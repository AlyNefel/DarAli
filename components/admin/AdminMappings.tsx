"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, RefreshCw, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ValidationResult {
  status: 'ok' | 'error';
  errors: string[];
}

export default function AdminMappings() {
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyMappings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/mappings/verify');
      const data = await res.json();
      setResult(data);
      if (data.status === 'error') {
        toast.error('Mapping inconsistencies detected');
      } else {
        toast.success('All mappings are valid');
      }
    } catch (error) {
      toast.error('Failed to verify mappings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyMappings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Room ID Mappings</h3>
          <p className="text-gray-500">Validate synchronization between internal rooms and external providers.</p>
        </div>
        <Button 
          onClick={verifyMappings} 
          disabled={loading}
          className="rounded-full gap-2"
        >
          {loading ? <RefreshCw className="animate-spin h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
          Re-verify Mappings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm rounded-3xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {result?.status === 'ok' ? (
                <>
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">Healthy</p>
                    <p className="text-xs text-green-600">All rooms correctly mapped</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">Issues Found</p>
                    <p className="text-xs text-red-600">{result?.errors.length || 0} inconsistencies detected</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-600 border-blue-100">Booking.com</Badge>
              <Badge variant="outline" className="rounded-full bg-pink-50 text-pink-600 border-pink-100">Airbnb</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Mapping Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-bold">1.</span> icalUrl
              <span className="text-gray-300">|</span>
              <span className="font-bold">2.</span> externalRoomId
            </div>
          </CardContent>
        </Card>
      </div>

      {result?.status === 'error' && (
        <Card className="border-none shadow-sm rounded-3xl border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-red-700">
              <AlertTriangle size={20} />
              Inconsistency Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.errors.map((error, index) => (
                <li key={index} className="flex gap-3 text-sm text-gray-700 bg-red-50/50 p-3 rounded-xl border border-red-100">
                  <div className="h-5 w-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  {error}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-lg">Mapping Configuration Guide</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <LinkIcon size={18} className="text-blue-500" />
                How to add a mapping
              </h4>
              <p className="text-sm text-gray-600">
                Mappings are currently managed via the database. Each mapping connects an internal 
                <code className="bg-gray-100 px-1 rounded text-pink-600">roomTypeId</code> to an 
                external provider's ID or iCal URL.
              </p>
              <div className="bg-gray-900 rounded-xl p-4 text-xs font-mono text-gray-300 overflow-x-auto">
                <pre>
{`{
  "internalRoomId": "65f...",
  "provider": "booking",
  "externalRoomId": "room_123",
  "icalUrl": "https://booking.com/ical/..."
}`}
                </pre>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle size={18} className="text-orange-500" />
                Validation Rules
              </h4>
              <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                <li>Every room must have a mapping for all active providers.</li>
                <li>External IDs must be unique per provider.</li>
                <li>iCal URLs must be unique per provider.</li>
                <li>Internal Room ID is the single source of truth.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
