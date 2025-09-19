import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Camera, Shield, Phone, MapPin, 
  ArrowRight, ArrowLeft, CheckCircle, Check, AlertCircle, Info
} from 'lucide-react';
import DocumentVerification from './DocumentVerification';

/**
 * Real-time validation hook for form fields
 */
interface FormData {
  name: string;
  age: string;
  nationality: string;
  phone: string;
  email: string;
  emergencyContact: string;
  destination: string;
  duration: string;
  purpose: string;
  idType: string;
  interests: string[];
}

const useFormValidation = () => {
  const validateField = useCallback((field: string, value: string | string[], formData: FormData) => {
    switch (field) {
      case 'name': {
        if (!value || (typeof value === 'string' && value.trim().length < 2)) {
          return 'Name must be at least 2 characters';
        }
        if (typeof value === 'string' && value.trim().length > 50) {
          return 'Name must be less than 50 characters';
        }
        if (typeof value === 'string' && !/^[a-zA-Z\s.'-]+$/.test(value.trim())) {
          return 'Name can only contain letters, spaces, periods, hyphens, and apostrophes';
        }
        return '';
      }

      case 'age': {
        const age = parseInt(value as string);
        if (!value || isNaN(age)) {
          return 'Age is required';
        }
        if (age < 16 || age > 120) {
          return 'Age must be between 16 and 120';
        }
        return '';
      }

      case 'phone': {
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Phone number is required';
        }
        if (typeof value === 'string' && !/^\+?[\d\s-()]+$/.test(value.trim())) {
          return 'Please enter a valid phone number';
        }
        if (typeof value === 'string' && value.replace(/\D/g, '').length < 10) {
          return 'Phone number must be at least 10 digits';
        }
        return '';
      }

      case 'email': {
        if (value && typeof value === 'string' && value.trim().length > 0) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
            return 'Please enter a valid email address';
          }
        }
        return '';
      }

      case 'emergencyContact': {
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Emergency contact is required';
        }
        if (typeof value === 'string' && !/^\+?[\d\s-()]+$/.test(value.trim())) {
          return 'Please enter a valid phone number';
        }
        if (typeof value === 'string' && value.replace(/\D/g, '').length < 10) {
          return 'Emergency contact must be at least 10 digits';
        }
        if (typeof value === 'string' && formData.phone && value.replace(/\D/g, '') === formData.phone.replace(/\D/g, '')) {
          return 'Emergency contact cannot be the same as your phone number';
        }
        return '';
      }

      case 'destination': {
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Please select a destination';
        }
        return '';
      }

      case 'duration': {
        const duration = parseInt(value as string);
        if (!value || isNaN(duration)) {
          return 'Duration is required';
        }
        if (duration < 1 || duration > 180) {
          return 'Duration must be between 1 and 180 days';
        }
        return '';
      }

      default:
        return '';
    }
  }, []);

  return { validateField };
};

/**
 * Enhanced Input Component with real-time validation and improved UX
 */
const ValidatedInput: React.FC<{
  type: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  'aria-label'?: string;
  disabled?: boolean;
}> = ({ 
  type, 
  value, 
  onChange, 
  onBlur, 
  placeholder, 
  icon, 
  error, 
  required, 
  className, 
  'aria-label': ariaLabel,
  disabled = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Real-time validation feedback
    if (newValue.length > 0) {
      setIsValid(!error);
    } else {
      setIsValid(null);
    }
  }, [onChange, error]);

  const inputClasses = `
    w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-300 text-base
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${error ? 'border-red-400 bg-red-50 focus:border-red-500' : 
      isValid === true ? 'border-emerald-400 bg-emerald-50 focus:border-emerald-500' :
      isFocused ? 'border-blue-400 bg-blue-50 focus:border-blue-500' : 
      'border-gray-300 bg-white hover:border-gray-400'}
    focus:outline-none focus:ring-4 focus:ring-opacity-20
    ${error ? 'focus:ring-red-500' : 
      isValid === true ? 'focus:ring-emerald-500' : 'focus:ring-blue-500'}
    ${className || ''}
  `;

  return (
    <div className="relative">
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          placeholder={placeholder}
          className={inputClasses}
          aria-label={ariaLabel}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${ariaLabel}-error` : undefined}
          disabled={disabled}
        />
        
        {/* Left Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        
        {/* Right Status Icon */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {error ? (
            <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
          ) : isValid === true ? (
            <Check className="w-5 h-5 text-emerald-500 animate-bounce" />
          ) : null}
        </div>
      </div>
      
      {error && (
        <p 
          id={`${ariaLabel}-error`}
          className="text-red-600 text-sm mt-2 flex items-center animate-fadeIn"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * Enhanced Select Component with improved UX
 */
const ValidatedSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
  required?: boolean;
  'aria-label'?: string;
  disabled?: boolean;
}> = ({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  icon, 
  error, 
  required, 
  'aria-label': ariaLabel,
  disabled = false
}) => {
  const selectClasses = `
    w-full pl-12 pr-8 py-4 border-2 rounded-xl transition-all duration-300 text-base appearance-none
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${error ? 'border-red-400 bg-red-50' : 
      value ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 bg-white hover:border-gray-400'}
    focus:outline-none focus:ring-4 focus:ring-opacity-20
    ${error ? 'focus:ring-red-500 focus:border-red-500' : 
      value ? 'focus:ring-emerald-500 focus:border-emerald-500' : 'focus:ring-blue-500 focus:border-blue-500'}
  `;

  return (
    <div className="relative">
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={selectClasses}
          aria-label={ariaLabel}
          aria-required={required}
          aria-invalid={!!error}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Left Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        
        {/* Right Status/Arrow Icon */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {error ? (
            <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
          ) : value ? (
            <Check className="w-5 h-5 text-emerald-500 animate-bounce" />
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>
      
      {error && (
        <p className="text-red-600 text-sm mt-2 flex items-center animate-fadeIn" role="alert">
          <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * KioskRegistration - Modern tourist registration interface
 * Enhanced with real-time validation, better UX, and improved accessibility
 */
const KioskRegistration: React.FC = () => {
  // Form state management
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    nationality: 'Indian',
    phone: '',
    email: '',
    emergencyContact: '',
    destination: '',
    duration: '',
    purpose: 'Tourism',
    idType: 'Passport',
    interests: []
  });
  
  // Enhanced validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState(false);
  
  const navigate = useNavigate();
  const { validateField } = useFormValidation();
  const totalSteps = 4;

  // Real-time field validation
  const validateFieldRealTime = useCallback((field: string, value: string | string[]) => {
    const error = validateField(field, value, formData);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
    return !error;
  }, [validateField, formData]);

  // Handle form input changes with real-time validation
  const handleInputChange = useCallback((field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    
    // Real-time validation
    validateFieldRealTime(field, value);
  }, [validateFieldRealTime]);

  // Handle field blur events
  const handleFieldBlur = useCallback((field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    const value = formData[field as keyof typeof formData];
    validateFieldRealTime(field, value);
  }, [formData, validateFieldRealTime]);

  // Enhanced form validation for current step
  const validateCurrentStep = useCallback((): boolean => {
    setIsValidating(true);
    const fieldsToValidate: string[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate.push('name', 'age', 'phone');
      if (formData.email) fieldsToValidate.push('email');
    } else if (currentStep === 2) {
      fieldsToValidate.push('emergencyContact');
    } else if (currentStep === 3) {
      fieldsToValidate.push('destination', 'duration');
    }
    
    let isValid = true;
    const newErrors: Record<string, string> = {};
    
    fieldsToValidate.forEach(field => {
      const value = formData[field as keyof typeof formData];
      const error = validateField(field, value, formData);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
      setTouchedFields(prev => ({ ...prev, [field]: true }));
    });
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    setIsValidating(false);
    return isValid;
  }, [currentStep, formData, validateField]);

  // Calculate step completion percentage
  const getStepProgress = useMemo(() => {
    const stepFields = {
      1: ['name', 'age', 'phone'],
      2: ['emergencyContact'],
      3: ['destination', 'duration'],
      4: []
    };
    
    const currentFields = stepFields[currentStep as keyof typeof stepFields] || [];
    const completedFields = currentFields.filter(field => {
      const value = formData[field as keyof typeof formData];
      return value && !errors[field];
    });
    
    return currentFields.length > 0 ? (completedFields.length / currentFields.length) * 100 : 0;
  }, [currentStep, formData, errors]);

  // Navigation between steps
  const nextStep = useCallback(() => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else {
        navigate('/registration/complete');
      }
    }
  }, [currentStep, totalSteps, validateCurrentStep, navigate]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Memoized options for better performance
  const nationalityOptions = useMemo(() => [
    { value: 'Indian', label: 'Indian' },
    { value: 'American', label: 'American' },
    { value: 'British', label: 'British' },
    { value: 'German', label: 'German' },
    { value: 'French', label: 'French' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Australian', label: 'Australian' },
    { value: 'Canadian', label: 'Canadian' },
    { value: 'Chinese', label: 'Chinese' },
    { value: 'Other', label: 'Other' }
  ], []);

  const destinationOptions = useMemo(() => [
    { value: 'Shillong, Meghalaya', label: 'Shillong, Meghalaya' },
    { value: 'Gangtok, Sikkim', label: 'Gangtok, Sikkim' },
    { value: 'Guwahati, Assam', label: 'Guwahati, Assam' },
    { value: 'Imphal, Manipur', label: 'Imphal, Manipur' },
    { value: 'Kohima, Nagaland', label: 'Kohima, Nagaland' },
    { value: 'Itanagar, Arunachal Pradesh', label: 'Itanagar, Arunachal Pradesh' },
    { value: 'Agartala, Tripura', label: 'Agartala, Tripura' },
    { value: 'Aizawl, Mizoram', label: 'Aizawl, Mizoram' },
    { value: 'Kaziranga, Assam', label: 'Kaziranga, Assam' },
    { value: 'Tawang, Arunachal Pradesh', label: 'Tawang, Arunachal Pradesh' }
  ], []);

  const purposeOptions = useMemo(() => [
    { value: 'Tourism', label: 'Tourism' },
    { value: 'Business', label: 'Business' },
    { value: 'Education', label: 'Education' },
    { value: 'Medical', label: 'Medical' },
    { value: 'Research', label: 'Research' },
    { value: 'Religious', label: 'Religious' },
    { value: 'Adventure', label: 'Adventure' },
    { value: 'Other', label: 'Other' }
  ], []);

  const idTypeOptions = useMemo(() => [
    { value: 'Passport', label: 'Passport' },
    { value: 'National_ID', label: 'National ID Card' },
    { value: 'Driving_License', label: 'Driving License' },
    { value: 'Voter_ID', label: 'Voter ID Card' }
  ], []);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="bg-blue-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Personal Information</h2>
              <p className="text-gray-600 text-lg">Please provide your basic details for registration</p>
              
              {/* Step Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mt-6 mb-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${getStepProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">{Math.round(getStepProgress)}% completed</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                  Full Name <span className="text-red-500 ml-1">*</span>
                </label>
                <ValidatedInput
                  type="text"
                  value={formData.name}
                  onChange={(value) => handleInputChange('name', value)}
                  onBlur={() => handleFieldBlur('name')}
                  placeholder="Enter your full name"
                  icon={<User className="w-5 h-5" />}
                  error={touchedFields.name ? errors.name : undefined}
                  required={true}
                  aria-label="Full name"
                />
              </div>
              
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                  Age <span className="text-red-500 ml-1">*</span>
                </label>
                <ValidatedInput
                  type="number"
                  value={formData.age}
                  onChange={(value) => handleInputChange('age', value)}
                  onBlur={() => handleFieldBlur('age')}
                  placeholder="Enter your age"
                  icon={<span className="text-gray-400 text-lg">🔢</span>}
                  error={touchedFields.age ? errors.age : undefined}
                  required={true}
                  aria-label="Age"
                />
              </div>
              
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                  Nationality <span className="text-red-500 ml-1">*</span>
                </label>
                <ValidatedSelect
                  value={formData.nationality}
                  onChange={(value) => handleInputChange('nationality', value)}
                  options={nationalityOptions}
                  placeholder="Select nationality"
                  icon={<span className="text-gray-400 text-lg">🌎</span>}
                  required={true}
                  aria-label="Nationality"
                />
              </div>
              
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                  Phone Number <span className="text-red-500 ml-1">*</span>
                </label>
                <ValidatedInput
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => handleInputChange('phone', value)}
                  onBlur={() => handleFieldBlur('phone')}
                  placeholder="+91 9876543210"
                  icon={<Phone className="w-5 h-5" />}
                  error={touchedFields.phone ? errors.phone : undefined}
                  required={true}
                  aria-label="Phone number"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  Email Address (Optional)
                </label>
                <ValidatedInput
                  type="email"
                  value={formData.email}
                  onChange={(value) => handleInputChange('email', value)}
                  onBlur={() => handleFieldBlur('email')}
                  placeholder="your.email@example.com"
                  icon={<span className="text-gray-400 text-lg">✉️</span>}
                  error={touchedFields.email ? errors.email : undefined}
                  aria-label="Email address"
                />
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <Info className="w-4 h-4 mr-2 text-blue-500" />
                  We'll send your digital safety ID to this address
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mt-8">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">Privacy & Security</h3>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Your personal information is encrypted using AES-256 standards and stored securely. 
                    We comply with international data protection regulations and your data will never be shared 
                    without your explicit consent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="bg-emerald-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Phone className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Emergency Contact</h2>
              <p className="text-gray-600 text-lg">Provide a reliable emergency contact for your safety</p>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                  Emergency Contact Number <span className="text-red-500 ml-1">*</span>
                </label>
                <ValidatedInput
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={(value) => handleInputChange('emergencyContact', value)}
                  onBlur={() => handleFieldBlur('emergencyContact')}
                  placeholder="+91 9876543210"
                  icon={<Phone className="w-5 h-5" />}
                  error={touchedFields.emergencyContact ? errors.emergencyContact : undefined}
                  required={true}
                  aria-label="Emergency contact number"
                />
                <div className="flex items-center mt-3 text-sm text-gray-600">
                  <Info className="w-4 h-4 mr-2 text-blue-500" />
                  This contact will be notified in case of emergency
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-l-4 border-emerald-500 rounded-r-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-emerald-800 mb-3 flex items-center text-lg">
                    <CheckCircle className="w-6 h-6 mr-3 text-emerald-600" />
                    Instant Alerts
                  </h3>
                  <p className="text-sm text-emerald-700 leading-relaxed">
                    Your emergency contact receives real-time notifications if you trigger a safety alert 
                    or enter a caution zone. Notifications include your location and status.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center text-lg">
                    <Shield className="w-6 h-6 mr-3 text-blue-600" />
                    Privacy Control
                  </h3>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    You control what information is shared and when. Location sharing can be toggled 
                    on/off at any time through the mobile app.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-amber-800 mb-4 text-lg flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-amber-600" />
                  Important Safety Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ul className="text-sm text-amber-700 space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-3 text-amber-600 mt-0.5 flex-shrink-0" /> 
                      Emergency contacts receive automatic notifications in critical situations
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-3 text-amber-600 mt-0.5 flex-shrink-0" /> 
                      Location sharing can be enabled for family members
                    </li>
                  </ul>
                  <ul className="text-sm text-amber-700 space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-3 text-amber-600 mt-0.5 flex-shrink-0" />
                      All emergency services are available 24/7 through our network
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-3 text-amber-600 mt-0.5 flex-shrink-0" /> 
                      Tourist police are specially trained for visitor assistance
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="bg-purple-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MapPin className="w-12 h-12 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Trip Information</h2>
              <p className="text-gray-600 text-lg">Tell us about your travel plans in Northeast India</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                  Primary Destination <span className="text-red-500 ml-1">*</span>
                </label>
                <ValidatedSelect
                  value={formData.destination}
                  onChange={(value) => handleInputChange('destination', value)}
                  options={destinationOptions}
                  placeholder="Select destination"
                  icon={<MapPin className="w-5 h-5" />}
                  error={touchedFields.destination ? errors.destination : undefined}
                  required={true}
                  aria-label="Primary destination"
                />
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <Info className="w-4 h-4 mr-2 text-blue-500" />
                  Select your primary destination in Northeast India
                </div>
              </div>
              
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3 flex items-center">
                  Duration (Days) <span className="text-red-500 ml-1">*</span>
                </label>
                <ValidatedInput
                  type="number"
                  value={formData.duration}
                  onChange={(value) => handleInputChange('duration', value)}
                  onBlur={() => handleFieldBlur('duration')}
                  placeholder="Number of days"
                  icon={<span className="text-gray-400 text-lg">📅</span>}
                  error={touchedFields.duration ? errors.duration : undefined}
                  required={true}
                  aria-label="Duration in days"
                />
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <Info className="w-4 h-4 mr-2 text-blue-500" />
                  Your digital ID is valid for this duration
                </div>
              </div>
              
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">Purpose of Visit</label>
                <ValidatedSelect
                  value={formData.purpose}
                  onChange={(value) => handleInputChange('purpose', value)}
                  options={purposeOptions}
                  placeholder="Select purpose"
                  icon={<span className="text-gray-400 text-lg">🎯</span>}
                  aria-label="Purpose of visit"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">ID Type</label>
                <ValidatedSelect
                  value={formData.idType}
                  onChange={(value) => handleInputChange('idType', value)}
                  options={idTypeOptions}
                  placeholder="Select ID type"
                  icon={<span className="text-gray-400 text-lg">🪪</span>}
                  aria-label="ID type"
                />
              </div>
            </div>
            
            {/* Tourist Interests Section - Enhanced */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></span>
                Travel Interests (Optional)
              </h3>
              <p className="text-sm text-gray-600 mb-6 flex items-center">
                <Info className="w-4 h-4 mr-2 text-blue-500" />
                Select your interests to receive personalized safety tips and recommendations
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { id: 'nature', label: 'Nature & Wildlife', icon: '🌿' },
                  { id: 'culture', label: 'Cultural Heritage', icon: '🏛️' },
                  { id: 'adventure', label: 'Adventure Sports', icon: '🧗‍♀️' },
                  { id: 'food', label: 'Local Cuisine', icon: '🍲' },
                  { id: 'spiritual', label: 'Spiritual Sites', icon: '🕌' },
                  { id: 'shopping', label: 'Local Crafts', icon: '🛍️' }
                ].map(interest => (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => handleInputChange('interests', 
                      formData.interests.includes(interest.id)
                        ? formData.interests.filter(i => i !== interest.id)
                        : [...formData.interests, interest.id]
                    )}
                    className={`flex items-center px-4 py-3 rounded-xl border-2 transition-all duration-300 hover:shadow-md group focus:outline-none focus:ring-4 focus:ring-blue-500/30 ${
                      formData.interests.includes(interest.id)
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400 text-blue-700 shadow-md scale-105'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                    aria-pressed={formData.interests.includes(interest.id)}
                    aria-label={`${interest.label} - ${formData.interests.includes(interest.id) ? 'selected' : 'not selected'}`}
                  >
                    <span className="mr-3 text-lg group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                      {interest.icon}
                    </span>
                    <span className="text-sm font-medium flex-1">{interest.label}</span>
                    {formData.interests.includes(interest.id) && (
                      <Check className="w-4 h-4 ml-2 text-blue-600 animate-bounce" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mt-8 shadow-sm">
              <h3 className="font-semibold text-blue-800 mb-4 text-lg flex items-center">
                <CheckCircle className="w-6 h-6 mr-3 text-blue-600" />
                Recommended Safety Measures
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ul className="text-sm text-blue-700 space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-3 text-blue-600 mt-0.5 flex-shrink-0" /> 
                    Download the Tourist Safety mobile app for real-time updates
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    Enable location sharing with trusted authorities
                  </li>
                </ul>
                <ul className="text-sm text-blue-700 space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    Keep emergency contacts updated throughout your journey
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-3 text-blue-600 mt-0.5 flex-shrink-0" /> 
                    Follow local guidelines and safety restrictions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="bg-red-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md">
                <Camera className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Document Verification</h2>
              <p className="text-gray-600">Scan your identification document for verification</p>
            </div>

            <div className="space-y-8">
              {/* Functional scanner interface */}
              <DocumentVerification 
                onScanComplete={(result: { success: boolean; data?: Record<string, unknown> }) => {
                  // Process scan result
                  console.log('Scan completed:', result);
                  // Move to next step automatically on successful scan
                  if (result.success) {
                    setTimeout(() => nextStep(), 1500);
                  }
                }}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 relative overflow-hidden">
      {/* Skip to main content for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white z-50"
      >
        Skip to main content
      </a>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-20">
        <div className="max-w-6xl w-full">
          {/* Header with logo */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 backdrop-blur-fallback border border-white/20 shadow-xl">
              <Shield className="w-12 h-12 text-white" aria-hidden="true" />
            </div>
          </div>
          
          {/* Apple-Inspired Enhanced Progress Stepper */}
          <div className="mb-12 max-w-4xl mx-auto">
            {/* Main Progress Container */}
            <div className="relative">
              {/* Background Progress Track */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/20 hidden md:block"></div>
              
              {/* Active Progress Line */}
              <div 
                className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-blue-400 transition-all duration-1000 ease-out hidden md:block"
                style={{ 
                  width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
                  boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)'
                }}
              ></div>
              
              {/* Step Indicators */}
              <div className="flex justify-between items-center relative z-10">
                {Array.from({ length: totalSteps }).map((_, index) => {
                  const stepNumber = index + 1;
                  const isCompleted = stepNumber < currentStep;
                  const isCurrent = stepNumber === currentStep;
                  // const isUpcoming = stepNumber > currentStep;
                  
                  return (
                    <div key={index} className="flex flex-col items-center group">
                      {/* Step Circle */}
                      <div className="relative">
                        {/* Glow Effect for Current Step */}
                        {isCurrent && (
                          <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
                        )}
                        
                        {/* Main Step Circle */}
                        <div 
                          className={`
                            relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm
                            transition-all duration-500 ease-out transform
                            ${isCompleted 
                              ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-xl scale-110 hover:scale-125' 
                              : isCurrent 
                              ? 'bg-white text-blue-600 shadow-2xl scale-125 ring-4 ring-white/40' 
                              : 'bg-white/20 text-white/60 scale-100 hover:scale-105'
                            }
                            ${isCurrent ? 'animate-pulse' : ''}
                          `}
                          role="progressbar"
                          aria-valuenow={stepNumber}
                          aria-valuemax={totalSteps}
                          aria-label={`Step ${stepNumber} of ${totalSteps}`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 animate-bounce" />
                          ) : (
                            <span className={`${isCurrent ? 'animate-pulse' : ''}`}>
                              {stepNumber}
                            </span>
                          )}
                        </div>
                        
                        {/* Completion Checkmark Animation */}
                        {isCompleted && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          </div>
                        )}
                      </div>
                      
                      {/* Step Label */}
                      <div className="mt-4 text-center">
                        <div 
                          className={`
                            text-xs md:text-sm font-semibold transition-all duration-300
                            ${isCurrent 
                              ? 'text-white transform scale-105' 
                              : isCompleted 
                              ? 'text-emerald-200' 
                              : 'text-blue-200/70'
                            }
                          `}
                        >
                          {['Personal Info', 'Emergency Contact', 'Travel Details', 'Verification'][index]}
                        </div>
                        
                        {/* Step Description */}
                        <div 
                          className={`
                            text-xs mt-1 transition-all duration-300 max-w-20 mx-auto
                            ${isCurrent 
                              ? 'text-blue-100 opacity-100' 
                              : isCompleted 
                              ? 'text-emerald-100 opacity-80' 
                              : 'text-blue-200/50 opacity-60'
                            }
                          `}
                        >
                          {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Progress Summary */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">
                  Step {currentStep} of {totalSteps} • {Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)}% Complete
                </span>
                <div className="w-8 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <main id="main-content" className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="p-6 md:p-10">
              {/* Current step content with animation */}
              <div key={currentStep} className="animate-fadeIn">
                {renderStep()}
              </div>

              {/* Enhanced Navigation Buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-12 pt-8 border-t border-gray-200">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500/30'
                  }`}
                  aria-label="Go to previous step"
                >
                  <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={nextStep}
                  disabled={isValidating}
                  className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  aria-label={currentStep === totalSteps ? 'Complete registration' : 'Continue to next step'}
                >
                  {isValidating && (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                  )}
                  <span>
                    {isValidating ? 'Validating...' : 
                     currentStep === totalSteps ? 'Complete Registration' : 'Continue'}
                  </span>
                  {!isValidating && <ArrowRight className="w-5 h-5" aria-hidden="true" />}
                </button>
              </div>
              
              {/* Enhanced Help text */}
              <div className="text-center mt-8">
                <p className="text-gray-500 text-sm">
                  Need help? <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors focus:outline-none focus:underline">Contact support</button> or call 
                  <span className="text-blue-600 font-medium ml-1">1800-TOURIST</span>
                </p>
              </div>
            </div>
          </main>
          
          {/* Enhanced Footer */}
          <div className="text-center mt-8">
            <div className="flex justify-center items-center space-x-4 text-blue-100 text-sm">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" aria-hidden="true" />
                <span>Secure</span>
              </div>
              <div className="w-1 h-1 bg-blue-300 rounded-full" aria-hidden="true"></div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" aria-hidden="true" />
                <span>Encrypted</span>
              </div>
              <div className="w-1 h-1 bg-blue-300 rounded-full" aria-hidden="true"></div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" aria-hidden="true" />
                <span>Government Authorized</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KioskRegistration;