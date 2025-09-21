import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Upload, UserPlus, Zap, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Internship Allocation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Match students with companies using advanced AI technology. Upload CSV files or manually enter data, 
            then let our sentence-transformer and FAISS engine find the perfect matches.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Upload className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle>CSV Upload</CardTitle>
              <CardDescription>
                Upload student and company data via CSV files with automatic validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/upload">
                <Button className="w-full">Upload Data</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <UserPlus className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Manual Entry</CardTitle>
              <CardDescription>
                Add individual student and company records with real-time validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/manual">
                <Button variant="outline" className="w-full">Add Records</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-8 h-8 text-yellow-600 mb-2" />
              <CardTitle>AI Allocation</CardTitle>
              <CardDescription>
                Run intelligent matching using sentence transformers and FAISS indexing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/allocate">
                <Button variant="secondary" className="w-full">Run Allocation</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle>View Results</CardTitle>
              <CardDescription>
                Review allocation results and export data for further analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/allocate">
                <Button variant="ghost" className="w-full">View Results</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload Data</h3>
              <p className="text-gray-600">
                Upload CSV files with student profiles and company positions, or manually enter records
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Processing</h3>
              <p className="text-gray-600">
                Our AI engine processes skills, preferences, and requirements to create embeddings
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Matching</h3>
              <p className="text-gray-600">
                FAISS indexing finds the best matches based on compatibility scores
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
                <div className="text-gray-600">Students Supported</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-gray-600">Companies</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">&lt;30s</div>
                <div className="text-gray-600">Processing Time</div>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
    </Layout>
  );
}