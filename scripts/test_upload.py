#!/usr/bin/env python3
"""
Test script to upload CSV files to the backend
"""
import requests
import os

def test_upload():
    base_url = "http://localhost:8000"
    
    # Test health endpoint
    print("Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health")
        print(f"Health check: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Health check failed: {e}")
        return
    
    # Upload students CSV
    print("\nUploading students CSV...")
    try:
        with open("students_profiles_with_city.csv", "rb") as f:
            files = {"file": ("students_profiles_with_city.csv", f, "text/csv")}
            response = requests.post(f"{base_url}/upload/students", files=files)
            print(f"Students upload: {response.status_code}")
            if response.status_code == 200:
                result = response.json()
                print(f"Accepted: {result['accepted']}, Rejected: {result['rejected']}")
                if result['errors']:
                    print(f"Errors: {result['errors'][:3]}...")  # Show first 3 errors
            else:
                print(f"Error: {response.text}")
    except Exception as e:
        print(f"Students upload failed: {e}")
    
    # Upload companies CSV
    print("\nUploading companies CSV...")
    try:
        with open("company_positions.csv", "rb") as f:
            files = {"file": ("company_positions.csv", f, "text/csv")}
            response = requests.post(f"{base_url}/upload/companies", files=files)
            print(f"Companies upload: {response.status_code}")
            if response.status_code == 200:
                result = response.json()
                print(f"Accepted: {result['accepted']}, Rejected: {result['rejected']}")
                if result['errors']:
                    print(f"Errors: {result['errors'][:3]}...")  # Show first 3 errors
            else:
                print(f"Error: {response.text}")
    except Exception as e:
        print(f"Companies upload failed: {e}")
    
    # Test allocation
    print("\nTesting allocation...")
    try:
        response = requests.post(f"{base_url}/allocate")
        print(f"Allocation: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Total students: {result['total_students']}")
            print(f"Total companies: {result['total_companies']}")
            print(f"Allocations: {len(result['allocations'])}")
            print(f"Processing time: {result['processing_time']:.2f}s")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Allocation failed: {e}")

if __name__ == "__main__":
    test_upload()
