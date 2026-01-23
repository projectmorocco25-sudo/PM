/**
 * Wireframe: task-0.5.1.41-system-status.md
 * Route: /status
 * Implements: System status page showing system health, incident history, and maintenance schedule.
 * Wireframe Link: ../../../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.41-system-status.md
 */
'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';

interface SystemComponent {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: string;
}

interface Incident {
  title: string;
  date: string;
  duration: string;
  status: string;
}

export default function StatusPage() {
  const [overallStatus, setOverallStatus] = useState<'operational' | 'degraded' | 'outage'>('operational');
  const [components, setComponents] = useState<SystemComponent[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // For public status page, we'll use a simplified status check
        // In production, this would call shared_get_system_status() or a public status endpoint
        // For now, we'll show a default operational status
        
        // Simulate status check
        await new Promise((resolve) => setTimeout(resolve, 500));

        setOverallStatus('operational');
        setComponents([
          { name: 'Platform', status: 'operational', uptime: '99.9%' },
          { name: 'Database', status: 'operational', uptime: '99.9%' },
          { name: 'API', status: 'operational', uptime: '99.8%' },
          { name: 'Authentication', status: 'operational', uptime: '99.9%' },
        ]);
        setIncidents([
          {
            title: 'Scheduled Maintenance',
            date: 'January 10, 2025',
            duration: '2 hours',
            status: 'Completed',
          },
          {
            title: 'Database Performance Issue',
            date: 'January 5, 2025',
            duration: '30 minutes',
            status: 'Resolved',
          },
        ]);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching system status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-success-500';
      case 'degraded':
        return 'bg-warning-500';
      case 'outage':
        return 'bg-error-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-6 w-6" />;
      case 'degraded':
        return <AlertTriangle className="h-6 w-6" />;
      case 'outage':
        return <XCircle className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return 'All Systems Operational';
      case 'degraded':
        return 'System Degraded';
      case 'outage':
        return 'System Outage';
      default:
        return 'Unknown Status';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hours ago`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Page Title */}
      <h1 className="mb-12 text-4xl font-bold text-text-primary">System Status</h1>

      {/* Overall Status Section */}
      <div className={cn('mb-8 rounded-lg p-6 text-white', getStatusColor(overallStatus))}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(overallStatus)}
            <h2 className="text-2xl font-semibold">{getStatusText(overallStatus)}</h2>
          </div>
        </div>
        <p className="mt-2 text-sm opacity-90">Last updated: {formatTimeAgo(lastUpdated)}</p>
      </div>

      {/* System Components Section */}
      <div className="mb-8 rounded-lg border border-default bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold text-text-primary">System Components</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {components.map((component) => (
            <div key={component.name} className="rounded-lg border border-default bg-white p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">{component.name}</h3>
                {getStatusIcon(component.status)}
              </div>
              <p className="text-sm text-text-secondary">
                {component.status === 'operational' ? '🟢 Operational' : component.status === 'degraded' ? '🟡 Degraded' : '🔴 Outage'}
              </p>
              <p className="mt-2 text-sm text-text-secondary">{component.uptime} uptime</p>
            </div>
          ))}
        </div>
      </div>

      {/* Incident History Section */}
      <div className="mb-8 rounded-lg border border-default bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold text-text-primary">Incident History</h2>
        <div className="mb-4">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">Resolved Issues</h3>
          <div className="space-y-4">
            {incidents.map((incident, index) => (
              <div key={index} className="border-b border-default pb-4 last:border-b-0">
                <h4 className="mb-2 font-semibold text-text-primary">{incident.title}</h4>
                <div className="space-y-1 text-sm text-text-secondary">
                  <p>Date: {incident.date}</p>
                  <p>Duration: {incident.duration}</p>
                  <p>Status: {incident.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Maintenance Schedule Section */}
      <div className="rounded-lg border border-default bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold text-text-primary">Maintenance Schedule</h2>
        <div>
          <h3 className="mb-4 text-lg font-semibold text-text-primary">Upcoming Maintenance</h3>
          <div className="rounded-lg border border-default bg-bg-secondary p-4">
            <h4 className="mb-2 font-semibold text-text-primary">Scheduled System Update</h4>
            <div className="space-y-1 text-sm text-text-secondary">
              <p>Date: February 5, 2025</p>
              <p>Time: 2:00 AM - 4:00 AM</p>
              <p>Impact: Minimal service disruption</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-text-secondary">No other scheduled maintenance.</p>
        </div>
      </div>
    </div>
  );
}
