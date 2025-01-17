import React from 'react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: 0,
    features: [
      'Up to 100 leads',
      'Basic contact management',
      'Email support',
    ],
  },
  {
    name: 'Advanced',
    price: 29,
    features: [
      'Up to 1,000 leads',
      'Advanced analytics',
      'Priority email support',
      'Custom fields',
    ],
  },
  {
    name: 'Professional',
    price: 99,
    features: [
      'Unlimited leads',
      'Advanced analytics',
      '24/7 phone support',
      'Custom fields',
      'API access',
      'Dedicated account manager',
    ],
  },
];

export function SubscriptionPlans() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:flex-col sm:align-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-center">
          Pricing Plans
        </h2>
        <p className="mt-5 text-xl text-gray-500 sm:text-center">
          Choose the perfect plan for your business
        </p>
      </div>

      <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
        {plans.map((plan) => (
          <div key={plan.name} className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white">
            <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
            <p className="mt-4">
              <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
              <span className="text-base font-medium text-gray-500">/month</span>
            </p>
            <ul className="mt-6 space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="ml-3 text-sm text-gray-500">{feature}</span>
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              {plan.price === 0 ? 'Get started' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}