import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Award, ShieldCheck, Printer, Calendar, BadgeInfo, Sparkles, Building2, Briefcase } from 'lucide-react';

export default function InterviewCertificates() {
  const { user } = useAuth();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCert, setActiveCert] = useState(null);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await api.get('/interview/analytics');
        if (res.data?.success) {
          // In user analytics we can get certificates or aggregate them
          const profileRes = await api.get('/dashboard');
          if (profileRes.data?.success) {
            setCerts(profileRes.data.data.user.interviewCertificates || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-400 text-xs animate-pulse">
        <Award className="w-6 h-6 animate-bounce mr-2 text-brand-primary" />
        Retrieving credentials...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto w-full">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/20 text-brand-primary text-xs font-bold">
          <Award className="w-3.5 h-3.5" />
          Credentials
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Earned <span className="text-gradient">Mock Certificates</span>
        </h1>
        <p className="text-xs text-slate-400">Official placement verification credentials issued for scoring above 70%.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Certificates Inventory list */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 h-fit">
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-brand-border/40 pb-2">
            Credentials List
          </h3>

          <div className="space-y-3">
            {certs.length > 0 ? (
              certs.map((cert, idx) => {
                const isActive = activeCert && activeCert.certificateId === cert.certificateId;
                return (
                  <button
                    key={cert.certificateId || idx}
                    onClick={() => setActiveCert(cert)}
                    className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-brand-primary/10 border-brand-primary/50 text-white'
                        : 'bg-white/2 border-brand-border/60 text-slate-400 hover:border-brand-border/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-brand-primary shrink-0" />
                      <div>
                        <h4 className="font-extrabold text-xs text-white leading-tight">
                          {cert.type || 'Mock Interview'}
                        </h4>
                        <p className="text-[9px] text-slate-400 leading-relaxed mt-1">
                          Role: {cert.role} {cert.company ? `at ${cert.company}` : ''}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-slate-500 text-[10px] gap-2">
                <ShieldCheck className="w-8 h-8 text-slate-600" />
                <span>No certificates earned yet. Achieve &ge; 70% to issue credentials.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Virtual Certificate Display Frame */}
        <div className="lg:col-span-2 space-y-6">
          {activeCert ? (
            <div className="space-y-6">
              {/* Certificate Border Frame */}
              <div
                id="printable-certificate"
                className="relative bg-brand-dark/45 border-4 border-double border-brand-primary/40 rounded-2xl p-8 md:p-12 text-center space-y-6 overflow-hidden max-w-2xl mx-auto shadow-2xl"
              >
                {/* Background decorative seals */}
                <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-brand-primary/5 blur-3xl pointer-events-none" />
                <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-brand-accent/5 blur-3xl pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">PrepAI Credential Verification</span>
                    <Sparkles className="w-5 h-5 text-brand-primary" />
                  </div>
                  <h2 className="font-extrabold text-2xl text-gradient tracking-tight">CERTIFICATE OF COMPLETION</h2>
                  <p className="text-[10px] text-slate-500 italic">This credential certifies that the candidate has successfully cleared mock placements assessment</p>
                </div>

                <div className="py-6 border-y border-brand-border/40 max-w-md mx-auto space-y-4">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Proudly Presented to</p>
                  <h3 className="text-xl font-black text-white tracking-wide">{user?.fullName || 'Candidate User'}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    For displaying technical competency in <strong>{activeCert.role}</strong> and scoring <strong>{activeCert.score}%</strong> in the <strong>{activeCert.type}</strong> simulation.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-xs text-slate-400">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">Issued On</span>
                    <span className="text-white font-extrabold flex items-center justify-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(activeCert.issuedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">Credential Verification Code</span>
                    <span className="text-brand-secondary font-extrabold font-mono uppercase">
                      {activeCert.certificateId}
                    </span>
                  </div>
                </div>

                {/* Stamp Seal */}
                <div className="flex justify-center pt-4">
                  <div className="w-16 h-16 rounded-full border-2 border-brand-success/50 flex items-center justify-center text-brand-success font-black text-[9px] uppercase tracking-wider rotate-12 bg-brand-success/5 select-none">
                    Verified Seal
                  </div>
                </div>
              </div>

              {/* Print controls */}
              <div className="flex justify-center">
                <button
                  onClick={handlePrint}
                  className="px-6 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow active:scale-95 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save Certificate
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center text-xs text-slate-500 space-y-3">
              <BadgeInfo className="w-10 h-10 mx-auto text-slate-600 animate-pulse" />
              <span>Select an earned credential card from the inventory list to preview and print.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
