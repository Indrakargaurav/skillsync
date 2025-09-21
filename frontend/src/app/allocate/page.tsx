'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Zap, Download, BarChart3, Clock, Users, Building2 } from 'lucide-react';
import { AllocationResult, AllocationResponse } from '@/types';

export default function AllocatePage() {
  const [isAllocating, setIsAllocating] = useState(false);
  const [result, setResult] = useState<AllocationResponse | null>(null);
  const [rows, setRows] = useState<AllocationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const pageSize = 25;
  const [progress, setProgress] = useState<number>(0);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAllocating) {
      setProgress(0);
      const id = setInterval(() => {
        setProgress((p) => Math.min(p + 3, 90));
      }, 120);
      return () => clearInterval(id);
    } else {
      // finish bar and then hide
      if (progress < 100) setProgress(100);
      const t = setTimeout(() => setProgress(0), 600);
      return () => clearTimeout(t);
    }
  }, [isAllocating]);

  // Load allocations when component mounts or when result changes
  useEffect(() => {
    if (result && result.allocations) {
      setRows(result.allocations);
    } else {
      loadAllocations();
    }
  }, [result]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const loadAllocations = async (opts?: { q?: string }) => {
    const qv = opts?.q ?? q;
    try {
      const res = await fetch(`http://localhost:8000/allocations`);
      if (!res.ok) throw new Error('Failed to load allocations');
      const data: AllocationResult[] = await res.json();
      const filtered = qv.trim() ? data.filter(a => 
        a.student_name.toLowerCase().includes(qv.trim().toLowerCase()) ||
        a.company_name.toLowerCase().includes(qv.trim().toLowerCase())
      ) : data;
      setRows(filtered);
    } catch (e: any) {
      setError(e.message || 'Failed to load allocations');
    }
  };

  const filterAllocations = (searchQuery: string) => {
    if (!result || !result.allocations) {
      console.log('No result or allocations available');
      return;
    }
    
    console.log('Filtering with query:', searchQuery);
    console.log('Available allocations:', result.allocations.length);
    
    const filtered = searchQuery.trim() ? result.allocations.filter(a => 
      a.student_name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      a.company_name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    ) : result.allocations;
    
    console.log('Filtered results:', filtered.length);
    setRows(filtered);
  };

  const runAllocation = async () => {
    setIsAllocating(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/allocate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: AllocationResponse = await response.json();
        setResult(data);
        setRows(data.allocations);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to run allocation');
      }
    } catch (error) {
      setError('Failed to connect to backend. Please check if the server is running.');
    } finally {
      setIsAllocating(false);
    }
  };

  const exportAllocations = async () => {
    try {
      const response = await fetch('http://localhost:8000/export/allocations');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'allocations.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError('Failed to export allocations');
      }
    } catch (error) {
      setError('Failed to export allocations');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Poor';
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Allocation</h1>
          <p className="text-lg text-gray-600">
            Run intelligent matching between students and companies using AI
          </p>
        </div>

        {/* Allocation Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-600" />
              Run Allocation Engine
            </CardTitle>
            <CardDescription>
              Click the button below to start the AI-powered matching process. This will analyze all student profiles and company positions to find the best matches.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {rows.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Search by student or company name..."
                    className="flex h-10 w-full sm:max-w-xs rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={q}
                    onChange={(e) => {
                      const value = e.target.value;
                      setQ(value);
                      // Immediate search for better UX
                      filterAllocations(value);
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { filterAllocations(e.currentTarget.value); } }}
                  />
                  <div className="flex gap-3">
                    <Button onClick={() => { filterAllocations(q); }} variant="secondary">Search</Button>
                    <Button onClick={() => { setQ(''); filterAllocations(''); }} variant="outline">Clear</Button>
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={runAllocation}
                loading={isAllocating}
                disabled={isAllocating}
                size="lg"
                className="flex-1"
              >
                <Zap className="w-5 h-5 mr-2" />
                {isAllocating ? 'Running Allocation...' : 'Run Allocation'}
              </Button>
              
              {rows.length > 0 && (
                <Button
                  onClick={exportAllocations}
                  variant="outline"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export CSV
                </Button>
              )}
              </div>
              {(isAllocating || progress > 0) && (
                <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-2 rounded bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 transition-all duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Allocation Results */}
        {rows.length > 0 && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{result?.total_students ?? rows.length}</p>
                      <p className="text-gray-600">Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Building2 className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{result?.total_companies ?? ''}</p>
                      <p className="text-gray-600">Companies</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{rows.length}</p>
                      <p className="text-gray-600">Matches</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="w-8 h-8 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{result?.processing_time ? `${result.processing_time.toFixed(2)}s` : ''}</p>
                      <p className="text-gray-600">Processing Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-red-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{result?.unallocated_count ?? 0}</p>
                      <p className="text-gray-600">Unallocated</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle>Allocation Results</CardTitle>
                <CardDescription>
                  Top matches between students and companies based on AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* No pagination; showing all allocations */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Match Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quality
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rows.map((allocation, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {allocation.student_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {allocation.student_id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {allocation.company_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {allocation.company_id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {(allocation.score * 100).toFixed(1)}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(allocation.score)}`}>
                              {getScoreLabel(allocation.score)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {rows.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No allocations found. Make sure you have uploaded student and company data.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Unallocated Students */}
        {result && result.unallocated_count && result.unallocated_count > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Not Allocated ({result.unallocated_count})</CardTitle>
              <CardDescription>
                Students without an assigned internship in this run
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {result.unallocated_students?.map((s, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.student_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.student_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>How the AI Allocation Works</CardTitle>
            <CardDescription>
              Understanding the matching process and scoring system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Text Processing</h3>
                <p className="text-gray-600 text-sm">
                  Skills, preferences, and requirements are converted into text representations for analysis
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-lg">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Embeddings</h3>
                <p className="text-gray-600 text-sm">
                  Sentence transformers create 384-dimensional embeddings for semantic understanding
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-lg">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">FAISS Matching</h3>
                <p className="text-gray-600 text-sm">
                  FAISS indexing finds the best matches using cosine similarity scoring
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Score Interpretation:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-100 rounded-full mr-2"></span>
                  <span>80%+ Excellent</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-yellow-100 rounded-full mr-2"></span>
                  <span>60-79% Good</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-orange-100 rounded-full mr-2"></span>
                  <span>40-59% Fair</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-red-100 rounded-full mr-2"></span>
                  <span>&lt;40% Poor</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
