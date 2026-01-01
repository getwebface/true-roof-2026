// HeadlessForm.tsx
// TrueRoof - Google Headless Form Component with Advanced Tracking
// High-class, beautiful form with comprehensive abandonment and conversion tracking
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { trackEvent, trackConversion } from '~/lib/tracking/behaviorTracker';

interface FormField {
  id: string; // Dummy ID that will be replaced with actual Google Form field IDs
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  placeholder: string;
  required: boolean;
  options?: string[];
  validation?: RegExp;
  errorMessage?: string;
}

interface HeadlessFormProps {
  formId: string;
  title?: string;
  subtitle?: string;
  submitText?: string;
  successMessage?: string;
  className?: string;
  variant?: 'light' | 'dark' | 'gradient';
  fields?: FormField[];
  googleFormId?: string; // Placeholder for actual Google Form ID
  trackingPrefix?: string;
}

const HeadlessForm: React.FC<HeadlessFormProps> = ({
  formId,
  title = 'Get Your Free Quote',
  subtitle = 'Schedule your inspection today',
  submitText = 'Request Quote',
  successMessage = 'Thank you! Our team will contact you shortly.',
  className = '',
  variant = 'gradient',
  fields = DEFAULT_FIELDS,
  googleFormId = 'DUMMY_GOOGLE_FORM_ID', // Placeholder - will be replaced with actual ID
  trackingPrefix = 'headless_form'
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [fieldInteractions, setFieldInteractions] = useState<Set<string>>(new Set());
  const formRef = useRef<HTMLFormElement>(null);

  // Track form start
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        if (!hasStarted) {
          setHasStarted(true);
          setStartTime(Date.now());
          trackEvent(`${trackingPrefix}_start`, {
            formId,
            timestamp: Date.now()
          });
        }
      }
    };

    const form = formRef.current;
    if (form) {
      form.addEventListener('focusin', handleFocus);
      return () => form.removeEventListener('focusin', handleFocus);
    }
  }, [hasStarted, formId, trackingPrefix]);

  // Track form abandonment
  useEffect(() => {
    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        // Check if form is being abandoned (no focus within form)
        setTimeout(() => {
          if (formRef.current && !formRef.current.contains(document.activeElement) && hasStarted && !isSubmitted) {
            trackEvent(`${trackingPrefix}_abandon`, {
              formId,
              fieldsFilled: Object.keys(formData).filter(key => formData[key].trim()).length,
              totalFields: fields.length,
              timeSpent: Date.now() - startTime,
              interactions: Array.from(fieldInteractions)
            });
          }
        }, 100);
      }
    };

    const form = formRef.current;
    if (form) {
      form.addEventListener('focusout', handleBlur);
      return () => form.removeEventListener('focusout', handleBlur);
    }
  }, [hasStarted, isSubmitted, formData, formId, startTime, fieldInteractions, trackingPrefix, fields.length]);

  const validateField = (field: FormField, value: string): string => {
    if (field.required && !value.trim()) {
      return `${field.label} is required`;
    }

    if (field.validation && value.trim()) {
      if (!field.validation.test(value)) {
        return field.errorMessage || `Please enter a valid ${field.label.toLowerCase()}`;
      }
    }

    return '';
  };

  const handleChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Track field interaction
    if (!fieldInteractions.has(fieldId)) {
      setFieldInteractions(prev => new Set([...prev, fieldId]));
      trackEvent(`${trackingPrefix}_field_interaction`, {
        formId,
        fieldId,
        fieldName: fields.find(f => f.id === fieldId)?.name || fieldId
      });
    }

    // Clear error for this field
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleFocus = (fieldId: string) => {
    setFocusedField(fieldId);
  };

  const handleBlur = (fieldId: string) => {
    setFocusedField(null);
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      const error = validateField(field, formData[fieldId] || '');
      if (error) {
        setErrors(prev => ({ ...prev, [fieldId]: error }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const value = formData[field.id] || '';
      const error = validateField(field, value);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate Google Form submission
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In production, this would be replaced with actual Google Form submission
      // const formDataObj = new FormData();
      // Object.keys(formData).forEach(key => {
      //   formDataObj.append(`entry.${googleFormId}_${key}`, formData[key]);
      // });
      // await fetch('https://docs.google.com/forms/d/e/[FORM_ID]/formResponse', {
      //   method: 'POST',
      //   body: formDataObj,
      //   mode: 'no-cors'
      // });

      // Track conversion
      trackEvent(`${trackingPrefix}_submit`, {
        formId,
        fieldsFilled: Object.keys(formData).filter(key => formData[key].trim()).length,
        formData: Object.keys(formData).reduce((acc, key) => {
          const field = fields.find(f => f.id === key);
          if (field && formData[key]) {
            acc[field.name] = formData[key];
          }
          return acc;
        }, {} as Record<string, string>)
      });

      trackConversion('headless_form', 'submit_success', 1);

      setIsSubmitted(true);
      
      // Track form completion
      trackEvent(`${trackingPrefix}_complete`, {
        formId,
        completionTime: Date.now() - startTime,
        totalFields: fields.length,
        fieldsFilled: Object.keys(formData).filter(key => formData[key].trim()).length
      });

    } catch (error) {
      console.error('Form submission error:', error);
      trackEvent(`${trackingPrefix}_error`, {
        formId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const variantStyles = {
    light: 'bg-white border-slate-200 text-slate-900',
    dark: 'bg-slate-900 border-white/10 text-white',
    gradient: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-white/10 text-white'
  };

  const inputStyles = {
    light: 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500',
    dark: 'bg-white/5 border-white/20 text-white placeholder-white/50 focus:border-emerald-500 focus:ring-emerald-500',
    gradient: 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-emerald-500 focus:ring-emerald-500'
  };

  const buttonStyles = {
    light: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    dark: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    gradient: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
  };

  return (
    <div className={clsx('relative overflow-hidden rounded-2xl shadow-2xl', className)}>
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>
      </div>

      <div className={clsx('relative p-8 rounded-2xl border backdrop-blur-sm', variantStyles[variant])}>
        {!isSubmitted ? (
          <>
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">{title}</h3>
              {subtitle && <p className="opacity-80">{subtitle}</p>}
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" data-component-id={`${formId}-form`}>
              {fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label htmlFor={field.id} className="block font-medium">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  
                  <div className="relative">
                    {field.type === 'select' ? (
                      <select
                        id={field.id}
                        name={field.name}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        onFocus={() => handleFocus(field.id)}
                        onBlur={() => handleBlur(field.id)}
                        className={clsx(
                          'w-full px-4 py-3 rounded-lg border transition-all outline-none appearance-none',
                          inputStyles[variant],
                          errors[field.id] ? 'border-red-500' : 'border-inherit',
                          focusedField === field.id && 'ring-2 ring-emerald-500/30'
                        )}
                        required={field.required}
                      >
                        <option value="">{field.placeholder}</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        id={field.id}
                        name={field.name}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        onFocus={() => handleFocus(field.id)}
                        onBlur={() => handleBlur(field.id)}
                        rows={4}
                        placeholder={field.placeholder}
                        className={clsx(
                          'w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none',
                          inputStyles[variant],
                          errors[field.id] ? 'border-red-500' : 'border-inherit',
                          focusedField === field.id && 'ring-2 ring-emerald-500/30'
                        )}
                        required={field.required}
                      />
                    ) : (
                      <input
                        id={field.id}
                        name={field.name}
                        type={field.type}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        onFocus={() => handleFocus(field.id)}
                        onBlur={() => handleBlur(field.id)}
                        placeholder={field.placeholder}
                        className={clsx(
                          'w-full px-4 py-3 rounded-lg border transition-all outline-none',
                          inputStyles[variant],
                          errors[field.id] ? 'border-red-500' : 'border-inherit',
                          focusedField === field.id && 'ring-2 ring-emerald-500/30'
                        )}
                        required={field.required}
                      />
                    )}

                    {/* Field Status Indicator */}
                    {focusedField === field.id && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      </div>
                    )}
                  </div>

                  {errors[field.id] && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-400"
                    >
                      {errors[field.id]}
                    </motion.p>
                  )}
                </div>
              ))}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={clsx(
                    'w-full py-4 px-6 rounded-xl font-bold transition-all duration-300',
                    buttonStyles[variant],
                    isSubmitting && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {submitText}
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  )}
                </button>

                <p className="text-center text-sm opacity-70 mt-4">
                  Your information is secure and will only be used to contact you about our services.
                </p>
              </div>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Form Submitted Successfully!</h3>
            <p className="opacity-80 mb-6">{successMessage}</p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({});
                setErrors({});
                setHasStarted(false);
                setFieldInteractions(new Set());
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Submit Another Response
            </button>
          </motion.div>
        )}

        {/* Form Status Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className={clsx(
            'w-2 h-2 rounded-full',
            hasStarted ? (isSubmitted ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse') : 'bg-slate-500'
          )}></div>
          <span className="text-xs opacity-70">
            {isSubmitted ? 'Submitted' : hasStarted ? 'In Progress' : 'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Default form fields with dummy IDs
const DEFAULT_FIELDS: FormField[] = [
  {
    id: 'dummy_name',
    name: 'entry.DUMMY_NAME_FIELD_ID',
    label: 'Full Name',
    type: 'text',
    placeholder: 'Enter your full name',
    required: true,
    validation: /^[a-zA-Z\s]{2,}$/,
    errorMessage: 'Please enter a valid name'
  },
  {
    id: 'dummy_email',
    name: 'entry.DUMMY_EMAIL_FIELD_ID',
    label: 'Email Address',
    type: 'email',
    placeholder: 'your.email@example.com',
    required: true,
    validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: 'Please enter a valid email address'
  },
  {
    id: 'dummy_phone',
    name: 'entry.DUMMY_PHONE_FIELD_ID',
    label: 'Phone Number',
    type: 'tel',
    placeholder: '(555) 123-4567',
    required: true,
    validation: /^[\+]?[1-9][\d\s\-\(\)]{8,}$/,
    errorMessage: 'Please enter a valid phone number'
  },
  {
    id: 'dummy_service',
    name: 'entry.DUMMY_SERVICE_FIELD_ID',
    label: 'Service Needed',
    type: 'select',
    placeholder: 'Select a service',
    required: true,
    options: ['Roof Inspection', 'Roof Repair', 'Roof Replacement', 'Gutter Cleaning', 'Emergency Repair']
  },
  {
    id: 'dummy_message',
    name: 'entry.DUMMY_MESSAGE_FIELD_ID',
    label: 'Additional Details',
    type: 'textarea',
    placeholder: 'Tell us about your roofing needs...',
    required: false
  }
];

export default HeadlessForm;
