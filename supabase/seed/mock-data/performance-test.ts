/**
 * Task 1.1.6.16: Performance Test Seed Data Scripts
 * 
 * Tests execution time, memory usage, and transaction size limits.
 */

import { log, logSection } from '../utils'
import { MOCK_COMPANIES } from './01-companies'
import { MOCK_PRODUCTS, MOCK_SKUS } from './02-products'
import { MOCK_ATC_CODES } from './03-atc-codes'
import { MOCK_CRITICAL_MEDICINES } from './04-critical-medicines'
import { MOCK_USERS } from './05-users'
import { MOCK_AAMS_SUBMISSIONS, MOCK_MSQ_SUBMISSIONS, MOCK_WSL_SUBMISSIONS } from './06-vci-submissions'
import { MOCK_THRESHOLDS } from './07-thresholds'
import { MOCK_REGISTRY_SUBMISSIONS } from './08-registry-submissions'
import { MOCK_BREACHES, MOCK_BREACH_ANALYSES } from './09-breaches'

// ============================================================================
// Types
// ============================================================================

interface PerformanceResult {
  dataset: string
  recordCount: number
  generationTimeMs: number
  memorySizeMB: number
  recordsPerSecond: number
}

interface BatchTestResult {
  batchSize: number
  totalRecords: number
  estimatedBatches: number
  estimatedTimeSeconds: number
  withinLimits: boolean
}

// ============================================================================
// Performance Measurement
// ============================================================================

function measureGenerationPerformance(): PerformanceResult[] {
  const results: PerformanceResult[] = []

  const datasets = [
    { name: 'Companies', data: MOCK_COMPANIES },
    { name: 'Products', data: MOCK_PRODUCTS },
    { name: 'SKUs', data: MOCK_SKUS },
    { name: 'ATC Codes', data: MOCK_ATC_CODES },
    { name: 'Critical Medicines', data: MOCK_CRITICAL_MEDICINES },
    { name: 'Users', data: MOCK_USERS },
    { name: 'AAMS Submissions', data: MOCK_AAMS_SUBMISSIONS },
    { name: 'MSQ Submissions', data: MOCK_MSQ_SUBMISSIONS },
    { name: 'WSL Submissions', data: MOCK_WSL_SUBMISSIONS },
    { name: 'Thresholds', data: MOCK_THRESHOLDS },
    { name: 'Registry Submissions', data: MOCK_REGISTRY_SUBMISSIONS },
    { name: 'Breaches', data: MOCK_BREACHES },
    { name: 'Breach Analyses', data: MOCK_BREACH_ANALYSES },
  ]

  for (const { name, data } of datasets) {
    const startTime = performance.now()
    const jsonString = JSON.stringify(data)
    const endTime = performance.now()

    const memorySizeBytes = Buffer.byteLength(jsonString, 'utf8')
    const memorySizeMB = memorySizeBytes / (1024 * 1024)
    const generationTimeMs = endTime - startTime
    const recordsPerSecond = data.length / (generationTimeMs / 1000) || 0

    results.push({
      dataset: name,
      recordCount: data.length,
      generationTimeMs: Math.round(generationTimeMs * 100) / 100,
      memorySizeMB: Math.round(memorySizeMB * 100) / 100,
      recordsPerSecond: Math.round(recordsPerSecond),
    })
  }

  return results
}

function calculateBatchRecommendations(results: PerformanceResult[]): BatchTestResult[] {
  const SUPABASE_BATCH_LIMIT = 1000 // Recommended batch size
  const MAX_PAYLOAD_MB = 6 // Supabase payload limit

  return results.map(r => {
    const recordsPerBatch = Math.min(SUPABASE_BATCH_LIMIT, 
      Math.floor(MAX_PAYLOAD_MB / (r.memorySizeMB / r.recordCount))
    )
    const estimatedBatches = Math.ceil(r.recordCount / recordsPerBatch)
    const estimatedTimeSeconds = estimatedBatches * 0.5 // Assume 500ms per batch

    return {
      batchSize: recordsPerBatch,
      totalRecords: r.recordCount,
      estimatedBatches,
      estimatedTimeSeconds: Math.round(estimatedTimeSeconds * 10) / 10,
      withinLimits: r.memorySizeMB < MAX_PAYLOAD_MB,
    }
  })
}

// ============================================================================
// Memory Analysis
// ============================================================================

function analyzeMemoryUsage(): { totalMB: number; breakdown: Record<string, number> } {
  const breakdown: Record<string, number> = {}
  
  const datasets = [
    { name: 'Companies', data: MOCK_COMPANIES },
    { name: 'Products', data: MOCK_PRODUCTS },
    { name: 'SKUs', data: MOCK_SKUS },
    { name: 'Users', data: MOCK_USERS },
    { name: 'AAMS', data: MOCK_AAMS_SUBMISSIONS },
    { name: 'MSQ', data: MOCK_MSQ_SUBMISSIONS },
    { name: 'WSL', data: MOCK_WSL_SUBMISSIONS },
    { name: 'Thresholds', data: MOCK_THRESHOLDS },
    { name: 'Registry', data: MOCK_REGISTRY_SUBMISSIONS },
    { name: 'Breaches', data: MOCK_BREACHES },
  ]

  let totalBytes = 0
  for (const { name, data } of datasets) {
    const bytes = Buffer.byteLength(JSON.stringify(data), 'utf8')
    breakdown[name] = Math.round((bytes / (1024 * 1024)) * 100) / 100
    totalBytes += bytes
  }

  return {
    totalMB: Math.round((totalBytes / (1024 * 1024)) * 100) / 100,
    breakdown,
  }
}

// ============================================================================
// Main Performance Test
// ============================================================================

export function runPerformanceTest() {
  logSection('Running Performance Tests')

  // 1. Generation Performance
  console.log('\n📊 Generation Performance:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('| Dataset             | Records  | Time(ms) | Size(MB) | Rec/s   |')
  console.log('|---------------------|----------|----------|----------|---------|')
  
  const perfResults = measureGenerationPerformance()
  for (const r of perfResults) {
    console.log(
      `| ${r.dataset.padEnd(19)} | ${String(r.recordCount).padStart(8)} | ${String(r.generationTimeMs).padStart(8)} | ${String(r.memorySizeMB).padStart(8)} | ${String(r.recordsPerSecond).padStart(7)} |`
    )
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // 2. Batch Recommendations
  console.log('📦 Batch Insert Recommendations:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('| Dataset             | Batch Size | Batches | Est. Time(s) | OK  |')
  console.log('|---------------------|------------|---------|--------------|-----|')
  
  const batchResults = calculateBatchRecommendations(perfResults)
  for (let i = 0; i < perfResults.length; i++) {
    const r = perfResults[i]
    const b = batchResults[i]
    console.log(
      `| ${r.dataset.padEnd(19)} | ${String(b.batchSize).padStart(10)} | ${String(b.estimatedBatches).padStart(7)} | ${String(b.estimatedTimeSeconds).padStart(12)} | ${b.withinLimits ? ' ✅ ' : ' ❌ '} |`
    )
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // 3. Memory Analysis
  const memory = analyzeMemoryUsage()
  console.log('💾 Memory Usage Analysis:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  for (const [name, mb] of Object.entries(memory.breakdown)) {
    const bar = '█'.repeat(Math.min(Math.round(mb * 10), 30))
    console.log(`  ${name.padEnd(12)}: ${String(mb).padStart(6)} MB ${bar}`)
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`  Total:         ${memory.totalMB} MB\n`)

  // 4. Summary
  const totalRecords = perfResults.reduce((acc, r) => acc + r.recordCount, 0)
  const totalTimeMs = perfResults.reduce((acc, r) => acc + r.generationTimeMs, 0)
  const estimatedInsertTime = batchResults.reduce((acc, b) => acc + b.estimatedTimeSeconds, 0)

  console.log('📈 Summary:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`  Total Records:           ${totalRecords.toLocaleString()}`)
  console.log(`  Generation Time:         ${(totalTimeMs / 1000).toFixed(2)}s`)
  console.log(`  Total Memory:            ${memory.totalMB} MB`)
  console.log(`  Est. Insert Time:        ${estimatedInsertTime.toFixed(1)}s`)
  console.log(`  Avg Records/Batch:       ~100`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const allWithinLimits = batchResults.every(b => b.withinLimits)
  if (allWithinLimits) {
    log('All datasets are within Supabase limits!', 'success')
  } else {
    log('Some datasets exceed recommended limits. Consider smaller batches.', 'warn')
  }

  return {
    totalRecords,
    totalMemoryMB: memory.totalMB,
    generationTimeMs: totalTimeMs,
    estimatedInsertTimeSeconds: estimatedInsertTime,
    allWithinLimits,
  }
}

// Run if executed directly
if (require.main === module) {
  runPerformanceTest()
}
