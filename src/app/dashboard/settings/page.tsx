"use client";

import { Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Account Settings</h1>
        <p className="text-sm text-neutral-500">Manage your profile and account preferences.</p>
      </div>

      <div className="space-y-6">
        <form className="space-y-6 rounded-2xl border border-neutral-200/50 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-neutral-900">Profile Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Full Name</label>
              <input 
                type="text" 
                id="name" 
                placeholder="John Doe"
                className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-sm placeholder-neutral-400 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email Address</label>
              <input 
                type="email" 
                id="email" 
                disabled
                placeholder="john@example.com"
                className="mt-1 block w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500 shadow-sm cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-neutral-500">Email address cannot be changed.</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="button" 
              className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:scale-105 hover:bg-neutral-800 active:scale-95"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </form>

        <form className="space-y-6 rounded-2xl border border-rose-200/50 bg-rose-50/30 p-6 shadow-sm">
          <h2 className="text-lg font-medium text-rose-600">Danger Zone</h2>
          <p className="text-sm text-neutral-600">Permanently delete your account and all associated data.</p>
          
          <div className="pt-2">
            <button 
              type="button" 
              className="inline-flex items-center gap-2 rounded-md border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-600 shadow-sm transition-colors hover:bg-rose-50"
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
