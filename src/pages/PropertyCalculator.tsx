"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, IndianRupee, Percent, Calendar, TrendingUp, Phone, MessageCircle, ArrowRight, Info } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { useSiteSettings } from '../hooks/useSiteSettings';

function formatINR(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

function formatINRFull(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

type Mode = 'emi' | 'affordability' | 'roi';

export default function PropertyCalculator() {
  const { settings } = useSiteSettings();

  useSEO({
    title: settings.seo_title || undefined,
    description: settings.seo_description || undefined,
    ogImage: settings.seo_og_image || undefined,
  });

  const [mode, setMode] = useState<Mode>('emi');

  const [propertyValue, setPropertyValue] = useState(5000000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(8.75);
  const [tenureYears, setTenureYears] = useState(20);

  const [monthlyIncome, setMonthlyIncome] = useState(100000);
  const [existingEmi, setExistingEmi] = useState(0);

  const [purchasePrice, setPurchasePrice] = useState(5000000);
  const [monthlyRent, setMonthlyRent] = useState(30000);
  const [occupancyPct, setOccupancyPct] = useState(70);
  const [annualExpenses, setAnnualExpenses] = useState(60000);

  const downPayment = (propertyValue * downPaymentPct) / 100;
  const loanAmount = propertyValue - downPayment;
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  const emi = loanAmount > 0 && monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : loanAmount / totalMonths;

  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  const maxLoanCapacity = ((monthlyIncome - existingEmi) * 0.5) * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)));
  const maxPropertyAffordable = maxLoanCapacity / (1 - downPaymentPct / 100);

  const annualRentIncome = monthlyRent * 12 * (occupancyPct / 100);
  const netAnnualIncome = annualRentIncome - annualExpenses;
  const grossYield = (annualRentIncome / purchasePrice) * 100;
  const netYield = (netAnnualIncome / purchasePrice) * 100;
  const paybackYears = netAnnualIncome > 0 ? purchasePrice / netAnnualIncome : 0;

  const whatsappNumber = settings.phone_raw || '919876543210';
  const whatsappMsg = `Hi! I used the WesternProperties EMI Calculator. I'm interested in properties around ${formatINR(propertyValue)}. Please help me find suitable options.`;

  const MODES: { id: Mode; label: string; icon: React.ElementType }[] = [
    { id: 'emi', label: 'EMI Calculator', icon: Calculator },
    { id: 'affordability', label: 'Affordability', icon: TrendingUp },
    { id: 'roi', label: 'Rental ROI', icon: Percent },
  ];

  return (
    <main className="min-h-screen pt-20 pb-16" style={{ background: 'linear-gradient(135deg, #f0f7f0 0%, #f4f9f4 100%)' }}>
      <div className="bg-[#0a2240] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            Free Tool
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Property Investment Calculator</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Calculate your EMI, check what you can afford, and analyse rental returns — all in one place.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mb-8">
          {MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                mode === id
                  ? 'bg-[#0a2240] text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {mode === 'emi' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#0a2240] mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#c9a84c]" />
                EMI Calculator
              </h2>

              <div className="space-y-6">
                <SliderField
                  label="Property Value"
                  value={propertyValue}
                  min={500000}
                  max={50000000}
                  step={100000}
                  display={formatINR(propertyValue)}
                  onChange={setPropertyValue}
                  icon={IndianRupee}
                />
                <SliderField
                  label="Down Payment"
                  value={downPaymentPct}
                  min={10}
                  max={90}
                  step={1}
                  display={`${downPaymentPct}% (${formatINR(downPayment)})`}
                  onChange={setDownPaymentPct}
                  icon={Percent}
                  hint="Minimum 10% required by most banks"
                />
                <SliderField
                  label="Interest Rate"
                  value={interestRate}
                  min={6}
                  max={18}
                  step={0.05}
                  display={`${interestRate.toFixed(2)}% per annum`}
                  onChange={setInterestRate}
                  icon={Percent}
                  hint="Current SBI rate: 8.50% | HDFC: 8.75%"
                />
                <SliderField
                  label="Loan Tenure"
                  value={tenureYears}
                  min={1}
                  max={30}
                  step={1}
                  display={`${tenureYears} years (${totalMonths} months)`}
                  onChange={setTenureYears}
                  icon={Calendar}
                />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="bg-gradient-to-br from-[#0a2240] to-[#0d3a6e] rounded-2xl p-6 text-white">
                <p className="text-white/60 text-sm mb-1">Monthly EMI</p>
                <p className="text-4xl font-bold text-[#c9a84c] mb-4">{formatINRFull(emi)}</p>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Loan Amount</span>
                    <span className="font-semibold">{formatINR(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Down Payment</span>
                    <span className="font-semibold">{formatINR(downPayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Total Interest</span>
                    <span className="font-semibold text-amber-300">{formatINR(totalInterest)}</span>
                  </div>
                  <div className="border-t border-white/20 pt-3 flex justify-between">
                    <span className="text-white/60">Total Payment</span>
                    <span className="font-bold text-lg">{formatINR(totalPayment)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>Principal</span>
                    <span>Interest</span>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#c9a84c] rounded-full transition-all duration-500"
                      style={{ width: `${Math.round((loanAmount / totalPayment) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-[#c9a84c]">{Math.round((loanAmount / totalPayment) * 100)}%</span>
                    <span className="text-white/50">{Math.round((totalInterest / totalPayment) * 100)}%</span>
                  </div>
                </div>
              </div>

              <ContactBanner whatsappNumber={whatsappNumber} whatsappMsg={whatsappMsg} />
            </div>
          </div>
        )}

        {mode === 'affordability' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#0a2240] mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#c9a84c]" />
                Affordability Check
              </h2>
              <div className="space-y-6">
                <SliderField
                  label="Monthly Take-Home Income"
                  value={monthlyIncome}
                  min={20000}
                  max={1000000}
                  step={5000}
                  display={formatINR(monthlyIncome)}
                  onChange={setMonthlyIncome}
                  icon={IndianRupee}
                  hint="Your net monthly income after tax"
                />
                <SliderField
                  label="Existing Monthly EMIs"
                  value={existingEmi}
                  min={0}
                  max={200000}
                  step={1000}
                  display={existingEmi > 0 ? formatINR(existingEmi) : 'None'}
                  onChange={setExistingEmi}
                  icon={IndianRupee}
                  hint="Car loan, personal loan, credit card EMIs etc."
                />
                <SliderField
                  label="Down Payment You Can Arrange"
                  value={downPaymentPct}
                  min={10}
                  max={80}
                  step={5}
                  display={`${downPaymentPct}%`}
                  onChange={setDownPaymentPct}
                  icon={Percent}
                />
                <SliderField
                  label="Preferred Interest Rate"
                  value={interestRate}
                  min={6}
                  max={18}
                  step={0.25}
                  display={`${interestRate.toFixed(2)}% p.a.`}
                  onChange={setInterestRate}
                  icon={Percent}
                />
                <SliderField
                  label="Preferred Loan Tenure"
                  value={tenureYears}
                  min={5}
                  max={30}
                  step={1}
                  display={`${tenureYears} years`}
                  onChange={setTenureYears}
                  icon={Calendar}
                />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="bg-gradient-to-br from-[#0a2240] to-[#0d3a6e] rounded-2xl p-6 text-white">
                <p className="text-white/60 text-sm mb-1">Maximum Property You Can Afford</p>
                <p className="text-4xl font-bold text-[#c9a84c] mb-4">{formatINR(maxPropertyAffordable)}</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Max Loan Eligibility</span>
                    <span className="font-semibold">{formatINR(maxLoanCapacity)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Recommended EMI</span>
                    <span className="font-semibold text-[#c9a84c]">{formatINR((monthlyIncome - existingEmi) * 0.5)}/mo</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-xs text-white/70 flex gap-2">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-300" />
                    <span>Banks typically allow up to 50% of income for all EMIs combined. This is a general estimate — actual eligibility varies by bank and income type.</span>
                  </div>
                </div>
              </div>
              <ContactBanner whatsappNumber={whatsappNumber} whatsappMsg={`Hi! I used the WesternProperties Affordability Calculator. I can afford a property up to ${formatINR(maxPropertyAffordable)}. Please show me relevant listings.`} />
            </div>
          </div>
        )}

        {mode === 'roi' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#0a2240] mb-6 flex items-center gap-2">
                <Percent className="w-5 h-5 text-[#c9a84c]" />
                Rental ROI Calculator
              </h2>
              <div className="space-y-6">
                <SliderField
                  label="Property Purchase Price"
                  value={purchasePrice}
                  min={1000000}
                  max={100000000}
                  step={100000}
                  display={formatINR(purchasePrice)}
                  onChange={setPurchasePrice}
                  icon={IndianRupee}
                />
                <SliderField
                  label="Expected Monthly Rent"
                  value={monthlyRent}
                  min={5000}
                  max={500000}
                  step={1000}
                  display={formatINRFull(monthlyRent) + '/month'}
                  onChange={setMonthlyRent}
                  icon={IndianRupee}
                  hint="For vacation rentals, use average monthly rent at expected occupancy"
                />
                <SliderField
                  label="Expected Occupancy Rate"
                  value={occupancyPct}
                  min={20}
                  max={100}
                  step={5}
                  display={`${occupancyPct}% per year`}
                  onChange={setOccupancyPct}
                  icon={Percent}
                  hint="Tourist season occupancy: 80–95% | Annual average: 60–75%"
                />
                <SliderField
                  label="Annual Expenses (maintenance, taxes, etc.)"
                  value={annualExpenses}
                  min={0}
                  max={500000}
                  step={5000}
                  display={annualExpenses > 0 ? formatINR(annualExpenses) : 'None'}
                  onChange={setAnnualExpenses}
                  icon={IndianRupee}
                  hint="Property tax, maintenance, insurance, management fees"
                />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="bg-gradient-to-br from-[#0a2240] to-[#0d3a6e] rounded-2xl p-6 text-white">
                <p className="text-white/60 text-sm mb-1">Annual Rental Income</p>
                <p className="text-4xl font-bold text-[#c9a84c] mb-4">{formatINR(annualRentIncome)}</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Gross Rental Yield</span>
                    <span className={`font-bold text-base ${grossYield >= 8 ? 'text-emerald-400' : grossYield >= 5 ? 'text-amber-300' : 'text-red-400'}`}>
                      {grossYield.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Net Yield (after expenses)</span>
                    <span className={`font-bold ${netYield >= 6 ? 'text-emerald-400' : netYield >= 3 ? 'text-amber-300' : 'text-red-400'}`}>
                      {netYield.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Net Annual Income</span>
                    <span className="font-semibold">{formatINR(netAnnualIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Payback Period</span>
                    <span className="font-semibold">{paybackYears > 0 ? `${paybackYears.toFixed(1)} years` : '—'}</span>
                  </div>
                  <div className={`rounded-xl p-3 text-xs flex gap-2 ${grossYield >= 8 ? 'bg-emerald-500/20 text-emerald-200' : grossYield >= 5 ? 'bg-amber-500/20 text-amber-200' : 'bg-red-500/20 text-red-200'}`}>
                    <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      {grossYield >= 10 ? 'Excellent return! This property shows strong rental potential.' :
                       grossYield >= 7 ? 'Good return. Above average for Indian real estate.' :
                       grossYield >= 5 ? 'Moderate return. Typical for most residential properties.' :
                       'Low return. Consider negotiating a lower purchase price or higher rent.'}
                    </span>
                  </div>
                </div>
              </div>
              <ContactBanner
                whatsappNumber={whatsappNumber}
                whatsappMsg={`Hi! I calculated rental ROI on WesternProperties. I'm looking for properties with good rental yield. Budget: ${formatINR(purchasePrice)}. Please help!`}
              />
            </div>
          </div>
        )}

        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-[#0a2240] mb-4">Explore Properties Within Your Budget</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['land_sale', 'room_rent', 'commercial_rent'].map((type) => (
              <Link
                key={type}
                href={`/properties?type=${type}`}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-[#c9a84c] hover:bg-[#c9a84c]/5 transition-all group"
              >
                <span className="font-semibold text-[#0a2240] text-sm">
                  {type === 'land_sale' ? 'Land for Sale' : type === 'room_rent' ? 'Room for Rent' : 'Commercial Spaces'}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#c9a84c] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
  icon: Icon,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
  icon: React.ElementType;
  hint?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Icon className="w-4 h-4 text-[#c9a84c]" />
          {label}
        </label>
        <span className="text-sm font-bold text-[#0a2240] bg-[#c9a84c]/10 px-3 py-1 rounded-lg">{display}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #c9a84c 0%, #c9a84c ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`,
          }}
        />
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
}

function ContactBanner({ whatsappNumber, whatsappMsg }: { whatsappNumber: string; whatsappMsg: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <div className="relative p-6" style={{
        backgroundImage: 'url(https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a2240]/90 to-[#0d3a6e]/85" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            Pre-Approved Loans Available
          </div>
          <h3 className="text-white font-bold text-lg mb-1 leading-tight">Ready to Invest in Goa?</h3>
          <p className="text-white/70 text-xs mb-4 leading-relaxed">Our experts will match you with properties that fit your exact budget and help you secure the best home loan rates.</p>

          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <p className="text-[#c9a84c] font-bold text-base">8.40%</p>
              <p className="text-white/60">Lowest Rate</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <p className="text-[#c9a84c] font-bold text-base">₹0</p>
              <p className="text-white/60">Processing Fee*</p>
            </div>
          </div>

          <div className="space-y-2">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25d366] hover:bg-[#20bf5a] text-white py-3 rounded-xl font-semibold text-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us Now
            </a>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 w-full bg-[#c9a84c] hover:bg-[#b8963e] text-white py-3 rounded-xl font-semibold text-sm transition-all"
            >
              <Phone className="w-4 h-4" />
              Get Free Consultation
            </Link>
          </div>
          <p className="text-white/30 text-xs mt-2 text-center">*Subject to bank terms & conditions</p>
        </div>
      </div>
    </div>
  );
}
