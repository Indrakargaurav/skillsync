'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface UploadResult {
  accepted: number;
  rejected: number;
  errors: string[];
}

export default function UploadPage() {
  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [companyFile, setCompanyFile] = useState<File | null>(null);
  const [studentResult, setStudentResult] = useState<UploadResult | null>(null);
  const [companyResult, setCompanyResult] = useState<UploadResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleStudentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setStudentFile(file || null);
    setStudentResult(null);
  };

  const handleCompanyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setCompanyFile(file || null);
    setCompanyResult(null);
  };

  const uploadStudents = async () => {
    if (!studentFile) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', studentFile);

    try {
      const response = await fetch('http://localhost:8000/upload/students', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      setStudentResult(result);
    } catch (error) {
      setStudentResult({
        accepted: 0,
        rejected: 0,
        errors: ['Failed to upload file. Please check if the backend is running.']
      });
    } finally {
      setIsUploading(false);
    }
  };

  const uploadCompanies = async () => {
    if (!companyFile) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', companyFile);

    try {
      const response = await fetch('http://localhost:8000/upload/companies', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      setCompanyResult(result);
    } catch (error) {
      setCompanyResult({
        accepted: 0,
        rejected: 0,
        errors: ['Failed to upload file. Please check if the backend is running.']
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload CSV Files</h1>
          <p className="text-lg text-gray-600">
            Upload student profiles and company positions via CSV files
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Students Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Students CSV Upload
              </CardTitle>
              <CardDescription>
                Upload a CSV file with student profiles. Expected columns: student_id, first_name, last_name, skills_text, degree, stream, city, state, pincode, caste, gender, financial_status, preferred_locations, other_notes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleStudentFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              
              <Button 
                onClick={uploadStudents} 
                disabled={!studentFile || isUploading}
                loading={isUploading}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Students
              </Button>

              {studentResult && (
                <div className="mt-4 p-4 rounded-md bg-gray-50">
                  <div className="flex items-center mb-2">
                    {studentResult.accepted > 0 ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    )}
                    <span className="font-medium">
                      {studentResult.accepted} accepted, {studentResult.rejected} rejected
                    </span>
                  </div>
                  
                  {studentResult.errors.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center mb-1">
                        <AlertCircle className="w-4 h-4 text-red-600 mr-1" />
                        <span className="text-sm font-medium text-red-600">Errors:</span>
                      </div>
                      <ul className="text-sm text-red-600 list-disc list-inside">
                        {studentResult.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Companies Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Companies CSV Upload
              </CardTitle>
              <CardDescription>
                Upload a CSV file with company positions. Expected columns: company_id, company_name, position_title, req_skills_text, job_description, location_city, location_state, stipend, openings, priority_flags, other_notes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCompanyFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>
              
              <Button 
                onClick={uploadCompanies} 
                disabled={!companyFile || isUploading}
                loading={isUploading}
                variant="secondary"
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Companies
              </Button>

              {companyResult && (
                <div className="mt-4 p-4 rounded-md bg-gray-50">
                  <div className="flex items-center mb-2">
                    {companyResult.accepted > 0 ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    )}
                    <span className="font-medium">
                      {companyResult.accepted} accepted, {companyResult.rejected} rejected
                    </span>
                  </div>
                  
                  {companyResult.errors.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center mb-1">
                        <AlertCircle className="w-4 h-4 text-red-600 mr-1" />
                        <span className="text-sm font-medium text-red-600">Errors:</span>
                      </div>
                      <ul className="text-sm text-red-600 list-disc list-inside">
                        {companyResult.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sample Data Info */}
        <Card>
          <CardHeader>
            <CardTitle>Sample Data Format</CardTitle>
            <CardDescription>
              Download sample CSV files to understand the expected format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg overflow-x-auto">
                <h4 className="font-medium mb-2">Students CSV Sample</h4>
                <div className="text-sm text-gray-600 space-y-1 whitespace-pre-wrap break-words">
                  <div className="break-words">student_id,first_name,last_name,skills_text,degree,stream,city,state,pincode,caste,gender,financial_status,preferred_locations,other_notes</div>
                  <div className="break-words">1,John,Doe,"Python, JavaScript, React",B.Tech,Computer Science,Mumbai,Maharashtra,400001,General,Male,Low,"Mumbai, Pune",Interested in web development</div>
                </div>
              </div>
              <div className="p-4 border rounded-lg overflow-x-auto">
                <h4 className="font-medium mb-2">Companies CSV Sample</h4>
                <div className="text-sm text-gray-600 space-y-1 whitespace-pre-wrap break-words">
                  <div className="break-words">company_id,company_name,position_title,req_skills_text,job_description,location_city,location_state,stipend,openings,priority_flags,other_notes</div>
                  <div className="break-words">1,TechCorp,Frontend Developer,"React, JavaScript, CSS",Develop user interfaces,Mumbai,Maharashtra,15000,2,High,Remote work available</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
