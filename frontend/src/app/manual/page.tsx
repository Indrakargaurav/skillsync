'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { UserPlus, Building2, CheckCircle, XCircle } from 'lucide-react';

interface StudentForm {
  first_name: string;
  last_name: string;
  skills_text: string;
  degree: string;
  stream: string;
  city: string;
  state: string;
  pincode: string;
  caste: string;
  gender: string;
  financial_status: string;
  preferred_locations: string;
  other_notes: string;
}

interface CompanyForm {
  company_name: string;
  position_title: string;
  req_skills_text: string;
  job_description: string;
  location_city: string;
  location_state: string;
  stipend: string;
  openings: string;
  priority_flags: string;
  other_notes: string;
}

export default function ManualPage() {
  const [activeTab, setActiveTab] = useState<'student' | 'company'>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const [studentForm, setStudentForm] = useState<StudentForm>({
    first_name: '',
    last_name: '',
    skills_text: '',
    degree: '',
    stream: '',
    city: '',
    state: '',
    pincode: '',
    caste: '',
    gender: '',
    financial_status: '',
    preferred_locations: '',
    other_notes: ''
  });

  const [companyForm, setCompanyForm] = useState<CompanyForm>({
    company_name: '',
    position_title: '',
    req_skills_text: '',
    job_description: '',
    location_city: '',
    location_state: '',
    stipend: '',
    openings: '1',
    priority_flags: '',
    other_notes: ''
  });

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('http://localhost:8000/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentForm),
      });

      if (response.ok) {
        setSubmitResult({ success: true, message: 'Student added successfully!' });
        setStudentForm({
          first_name: '',
          last_name: '',
          skills_text: '',
          degree: '',
          stream: '',
          city: '',
          state: '',
          pincode: '',
          caste: '',
          gender: '',
          financial_status: '',
          preferred_locations: '',
          other_notes: ''
        });
      } else {
        const error = await response.json();
        setSubmitResult({ success: false, message: error.detail || 'Failed to add student' });
      }
    } catch (error) {
      setSubmitResult({ success: false, message: 'Failed to connect to backend. Please check if the server is running.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const formData = {
        ...companyForm,
        stipend: companyForm.stipend ? parseFloat(companyForm.stipend) : null,
        openings: parseInt(companyForm.openings) || 1
      };

      const response = await fetch('http://localhost:8000/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitResult({ success: true, message: 'Company added successfully!' });
        setCompanyForm({
          company_name: '',
          position_title: '',
          req_skills_text: '',
          job_description: '',
          location_city: '',
          location_state: '',
          stipend: '',
          openings: '1',
          priority_flags: '',
          other_notes: ''
        });
      } else {
        const error = await response.json();
        setSubmitResult({ success: false, message: error.detail || 'Failed to add company' });
      }
    } catch (error) {
      setSubmitResult({ success: false, message: 'Failed to connect to backend. Please check if the server is running.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Manual Entry</h1>
          <p className="text-lg text-gray-600">
            Add individual student profiles and company positions manually
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'student'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Add Student
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'company'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="w-4 h-4 inline mr-2" />
              Add Company
            </button>
          </div>
        </div>

        {/* Submit Result */}
        {submitResult && (
          <div className={`p-4 rounded-md flex items-center ${
            submitResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {submitResult.success ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <XCircle className="w-5 h-5 mr-2" />
            )}
            {submitResult.message}
          </div>
        )}

        {/* Student Form */}
        {activeTab === 'student' && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Student</CardTitle>
              <CardDescription>
                Fill in the student's information. Required fields are marked with *
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStudentSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name *"
                    value={studentForm.first_name}
                    onChange={(e) => setStudentForm({ ...studentForm, first_name: e.target.value })}
                    required
                  />
                  <Input
                    label="Last Name *"
                    value={studentForm.last_name}
                    onChange={(e) => setStudentForm({ ...studentForm, last_name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Degree"
                    value={studentForm.degree}
                    onChange={(e) => setStudentForm({ ...studentForm, degree: e.target.value })}
                    placeholder="e.g., B.Tech, B.Sc, M.Tech"
                  />
                  <Input
                    label="Stream"
                    value={studentForm.stream}
                    onChange={(e) => setStudentForm({ ...studentForm, stream: e.target.value })}
                    placeholder="e.g., Computer Science, Electronics"
                  />
                </div>

                <Textarea
                  label="Skills"
                  value={studentForm.skills_text}
                  onChange={(e) => setStudentForm({ ...studentForm, skills_text: e.target.value })}
                  placeholder="e.g., Python, JavaScript, React, Machine Learning"
                  rows={3}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    value={studentForm.city}
                    onChange={(e) => setStudentForm({ ...studentForm, city: e.target.value })}
                  />
                  <Input
                    label="State"
                    value={studentForm.state}
                    onChange={(e) => setStudentForm({ ...studentForm, state: e.target.value })}
                  />
                  <Input
                    label="Pincode"
                    value={studentForm.pincode}
                    onChange={(e) => setStudentForm({ ...studentForm, pincode: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Gender"
                    value={studentForm.gender}
                    onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                    placeholder="Male, Female, Other"
                  />
                  <Input
                    label="Caste"
                    value={studentForm.caste}
                    onChange={(e) => setStudentForm({ ...studentForm, caste: e.target.value })}
                    placeholder="General, OBC, SC, ST"
                  />
                  <Input
                    label="Financial Status"
                    value={studentForm.financial_status}
                    onChange={(e) => setStudentForm({ ...studentForm, financial_status: e.target.value })}
                    placeholder="Low, Medium, High"
                  />
                </div>

                <Textarea
                  label="Preferred Locations"
                  value={studentForm.preferred_locations}
                  onChange={(e) => setStudentForm({ ...studentForm, preferred_locations: e.target.value })}
                  placeholder="e.g., Mumbai, Pune, Bangalore"
                  rows={2}
                />

                <Textarea
                  label="Other Notes"
                  value={studentForm.other_notes}
                  onChange={(e) => setStudentForm({ ...studentForm, other_notes: e.target.value })}
                  placeholder="Any additional information"
                  rows={2}
                />

                <Button type="submit" loading={isSubmitting} className="w-full">
                  Add Student
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Company Form */}
        {activeTab === 'company' && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Company Position</CardTitle>
              <CardDescription>
                Fill in the company and position details. Required fields are marked with *
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCompanySubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Company Name *"
                    value={companyForm.company_name}
                    onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })}
                    required
                  />
                  <Input
                    label="Position Title"
                    value={companyForm.position_title}
                    onChange={(e) => setCompanyForm({ ...companyForm, position_title: e.target.value })}
                    placeholder="e.g., Software Developer, Data Analyst"
                  />
                </div>

                <Textarea
                  label="Required Skills"
                  value={companyForm.req_skills_text}
                  onChange={(e) => setCompanyForm({ ...companyForm, req_skills_text: e.target.value })}
                  placeholder="e.g., Python, React, SQL, Machine Learning"
                  rows={3}
                />

                <Textarea
                  label="Job Description"
                  value={companyForm.job_description}
                  onChange={(e) => setCompanyForm({ ...companyForm, job_description: e.target.value })}
                  placeholder="Describe the role and responsibilities"
                  rows={4}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Location City"
                    value={companyForm.location_city}
                    onChange={(e) => setCompanyForm({ ...companyForm, location_city: e.target.value })}
                  />
                  <Input
                    label="Location State"
                    value={companyForm.location_state}
                    onChange={(e) => setCompanyForm({ ...companyForm, location_state: e.target.value })}
                  />
                  <Input
                    label="Stipend (₹)"
                    type="number"
                    value={companyForm.stipend}
                    onChange={(e) => setCompanyForm({ ...companyForm, stipend: e.target.value })}
                    placeholder="15000"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Number of Openings"
                    type="number"
                    min="1"
                    value={companyForm.openings}
                    onChange={(e) => setCompanyForm({ ...companyForm, openings: e.target.value })}
                  />
                  <Input
                    label="Priority Flags"
                    value={companyForm.priority_flags}
                    onChange={(e) => setCompanyForm({ ...companyForm, priority_flags: e.target.value })}
                    placeholder="e.g., High, Remote, Urgent"
                  />
                </div>

                <Textarea
                  label="Other Notes"
                  value={companyForm.other_notes}
                  onChange={(e) => setCompanyForm({ ...companyForm, other_notes: e.target.value })}
                  placeholder="Any additional information about the position"
                  rows={2}
                />

                <Button type="submit" loading={isSubmitting} className="w-full">
                  Add Company Position
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
