import { ChevronDown, Search, X } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

interface Country {
  code: string;
  name: string;
  phone_code: string;
  flag: string;
}

interface PhoneInputProps {
  value?: string;
  onChange: (value: string, countryCode: string) => void;
  countries: Country[];
  defaultCountry?: string;
  placeholder?: string;
  className?: string;
  error?: string;
}

// دول عربية افتراضية
const DEFAULT_COUNTRIES: Country[] = [
  { code: 'SA', name: 'السعودية', phone_code: '+966', flag: '🇸🇦' },
  { code: 'AE', name: 'الإمارات', phone_code: '+971', flag: '🇦🇪' },
  { code: 'KW', name: 'الكويت', phone_code: '+965', flag: '🇰🇼' },
  { code: 'QA', name: 'قطر', phone_code: '+974', flag: '🇶🇦' },
  { code: 'OM', name: 'عمان', phone_code: '+968', flag: '🇴🇲' },
  { code: 'BH', name: 'البحرين', phone_code: '+973', flag: '🇧🇭' },
  { code: 'JO', name: 'الأردن', phone_code: '+962', flag: '🇯🇴' },
  { code: 'LB', name: 'لبنان', phone_code: '+961', flag: '🇱🇧' },
  { code: 'EG', name: 'مصر', phone_code: '+20', flag: '🇪🇬' },
  { code: 'SY', name: 'سوريا', phone_code: '+963', flag: '🇸🇾' },
  { code: 'IQ', name: 'العراق', phone_code: '+964', flag: '🇮🇶' },
  { code: 'YE', name: 'اليمن', phone_code: '+967', flag: '🇾🇪' },
  { code: 'PS', name: 'فلسطين', phone_code: '+970', flag: '🇵🇸' },
  { code: 'LY', name: 'ليبيا', phone_code: '+218', flag: '🇱🇾' },
  { code: 'TN', name: 'تونس', phone_code: '+216', flag: '🇹🇳' },
  { code: 'DZ', name: 'الجزائر', phone_code: '+213', flag: '🇩🇿' },
  { code: 'MA', name: 'المغرب', phone_code: '+212', flag: '🇲🇦' },
  { code: 'MR', name: 'موريتانيا', phone_code: '+222', flag: '🇲🇷' },
  { code: 'SD', name: 'السودان', phone_code: '+249', flag: '🇸🇩' },
];

export function PhoneInput({
  value,
  onChange,
  countries = DEFAULT_COUNTRIES,
  defaultCountry = 'SA',
  placeholder = 'رقم الهاتف',
  className = '',
  error,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // تعيين الدولة الافتراضية
    const defaultCountryData = countries.find(c => c.code === defaultCountry);
    if (defaultCountryData) {
      setSelectedCountry(defaultCountryData);
    }

    // استخراج رقم الهاتف من القيمة
    if (value) {
      const match = value.match(/^(\+\d+)(.*)$/);
      if (match) {
        const code = match[1];
        const number = match[2];
        const country = countries.find(c => c.phone_code === code);
        if (country) {
          setSelectedCountry(country);
          setPhoneNumber(number);
        }
      } else {
        // إذا كان الرقم لا يحتوي على رمز الدولة
        setPhoneNumber(value.replace(/\D/g, ''));
      }
    }
  }, [value, countries, defaultCountry]);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name.includes(searchTerm) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.phone_code.includes(searchTerm)
  );

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm('');
    
    // تحديث القيمة الكاملة
    const fullNumber = `${country.phone_code}${phoneNumber}`;
    onChange(fullNumber, country.code);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value.replace(/\D/g, '');
    setPhoneNumber(newNumber);
    
    if (selectedCountry) {
      const fullNumber = `${selectedCountry.phone_code}${newNumber}`;
      onChange(fullNumber, selectedCountry.code);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="flex items-center border rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all">
        {/* زر اختيار الدولة */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-3 py-2.5 bg-gray-50 border-l hover:bg-gray-100 transition-colors min-w-fit"
        >
          {selectedCountry ? (
            <>
              <span className="text-xl">{selectedCountry.flag}</span>
              <span className="font-medium text-sm">{selectedCountry.phone_code}</span>
            </>
          ) : (
            <span className="text-gray-500 text-sm">+966</span>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* حقل رقم الهاتف */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 outline-none bg-white text-right"
          dir="ltr"
        />
      </div>

      {/* القائمة المنسدلة للدول */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-72 overflow-auto">
          {/* شريط البحث */}
          <div className="sticky top-0 bg-white p-2 border-b">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث عن دولة..."
                className="w-full pr-10 pl-8 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* قائمة الدول */}
          <div className="py-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleCountrySelect(country)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors text-right"
                >
                  <span className="text-xl">{country.flag}</span>
                  <span className="flex-1 text-sm">{country.name}</span>
                  <span className="text-sm text-gray-500">{country.phone_code}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                لا توجد نتائج مطابقة
              </div>
            )}
          </div>
        </div>
      )}

      {/* رسالة الخطأ */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

