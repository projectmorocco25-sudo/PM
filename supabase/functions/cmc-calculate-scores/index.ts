/**
 * Edge Function: cmc-calculate-scores
 * 
 * Scheduled function that calculates monthly compliance scores for all companies.
 * Runs on the first day of each month via pg_cron.
 * 
 * @module cmc-calculate-scores
 * @see docs/02-architecture/api/edge-functions.md
 */

import 'edge-runtime';
import { createServiceClient } from '../_shared/supabase-client.ts';
import { handleCorsPreflightRequest } from '../_shared/cors.ts';
import {
  successResponse,
  systemErrorResponse,
  authenticationErrorResponse,
} from '../_shared/response.ts';
import { createRequestLogger, getCorrelationId } from '../_shared/logger.ts';
import { createAuditLog, AuditAction } from '../_shared/audit.ts';

const FUNCTION_NAME = 'cmc-calculate-scores';

interface ScoreCalculationResult {
  companies_processed: number;
  scores_calculated: number;
  errors: Array<{ company_id: string; error: string }>;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  // Setup logging
  const correlationId = getCorrelationId(req);
  const log = createRequestLogger(FUNCTION_NAME, correlationId);

  try {
    log.info('Starting monthly compliance score calculation');

    // Verify authentication (service role key required)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      log.warn('No authorization header provided');
      return authenticationErrorResponse('Service role authorization required', correlationId);
    }

    // Parse request body for score period (optional)
    let scorePeriod: string;
    const now = new Date();
    const defaultPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    try {
      const body = await req.json();
      scorePeriod = body.score_period || defaultPeriod;
    } catch {
      scorePeriod = defaultPeriod;
    }

    log.info(`Calculating scores for period: ${scorePeriod}`);

    // Create Supabase client with service role
    const supabase = createServiceClient();

    const result: ScoreCalculationResult = {
      companies_processed: 0,
      scores_calculated: 0,
      errors: [],
    };

    // Fetch all active companies
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name')
      .eq('status', 'active');

    if (companiesError) {
      log.error('Failed to fetch companies', new Error(companiesError.message));
      return systemErrorResponse('Failed to fetch companies', correlationId);
    }

    if (!companies || companies.length === 0) {
      log.info('No active companies found');
      return successResponse(
        { ...result, message: 'No active companies found' },
        { correlation_id: correlationId }
      );
    }

    log.info(`Found ${companies.length} active companies`);

    // Parse score period
    const [year, month] = scorePeriod.split('-').map(Number);

    // Calculate scores for each company
    for (const company of companies) {
      result.companies_processed++;
      
      try {
        // Call RPC function to calculate compliance score
        const { data: scoreData, error: scoreError } = await supabase.rpc(
          'cmc_calculate_compliance_score',
          {
            p_company_id: company.id,
            p_year: year,
            p_month: month,
          }
        );

        if (scoreError) {
          result.errors.push({ company_id: company.id, error: scoreError.message });
          log.warn(`Failed to calculate score for company ${company.id}`, {
            error: scoreError.message,
          });
        } else {
          result.scores_calculated++;
          
          // Audit log the score calculation
          await createAuditLog(supabase, {
            table_name: 'compliance_scores',
            record_id: scoreData?.id,
            action: AuditAction.SCORE_CALCULATED,
            new_data: {
              company_id: company.id,
              score_period: scorePeriod,
              overall_score: scoreData?.overall_score,
            },
            metadata: {
              correlation_id: correlationId,
              trigger: 'scheduled',
            },
          });
        }
      } catch (error) {
        result.errors.push({ company_id: company.id, error: (error as Error).message });
        log.error(`Error calculating score for company ${company.id}`, error as Error);
      }
    }

    // Audit log the batch job completion
    await createAuditLog(supabase, {
      table_name: 'edge_function_executions',
      action: AuditAction.SCHEDULED_JOB_RUN,
      new_data: {
        function_name: FUNCTION_NAME,
        score_period: scorePeriod,
        ...result,
      },
      metadata: {
        correlation_id: correlationId,
      },
    });

    log.complete(200, result);
    
    return successResponse(result, { correlation_id: correlationId });

  } catch (error) {
    log.error('Unexpected error in score calculation', error as Error);
    
    // Try to audit log the failure
    try {
      const supabase = createServiceClient();
      await createAuditLog(supabase, {
        table_name: 'edge_function_executions',
        action: AuditAction.SCHEDULED_JOB_FAILED,
        new_data: {
          function_name: FUNCTION_NAME,
          error: (error as Error).message,
        },
        metadata: {
          correlation_id: correlationId,
        },
      });
    } catch {
      // Ignore audit log errors during error handling
    }

    return systemErrorResponse('Failed to calculate compliance scores', correlationId);
  }
});
