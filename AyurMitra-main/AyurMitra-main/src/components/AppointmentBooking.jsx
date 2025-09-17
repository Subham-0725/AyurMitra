import React, { useState } from 'react';
import { User, Stethoscope, AlertCircle, Loader2, Search, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';

const AppointmentBooking = ({ patientDetails }) => {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [showDoctors, setShowDoctors] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  
  const commonSymptoms = [
    'headache', 'migraine', 'stress', 'anxiety', 'insomnia', 'depression',
    'joint pain', 'arthritis', 'back pain', 'muscle pain', 'neck pain',
    'stomach pain', 'acidity', 'indigestion', 'constipation', 'bloating', 'nausea',
    'skin problems', 'acne', 'eczema', 'psoriasis', 'rash', 'itching',
    'cough', 'cold', 'asthma', 'breathing problems', 'chest pain',
    'fever', 'weakness', 'fatigue', 'body ache', 'chills',
    'diabetes', 'obesity', 'weight gain', 'hypertension', 'heart problems',
    'kidney problems', 'liver problems', 'thyroid', 'hormonal imbalance',
    'hair fall', 'dandruff', 'eye problems', 'vision issues', 'ear problems',
    'sleep disorders', 'chronic fatigue', 'digestive issues', 'menstrual problems'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!symptoms.trim()) {
      setError('Please describe your symptoms');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/panchakarma_doctor2.csv');
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          // Enhanced symptom preprocessing
          const synonymMap = {
            'pain': ['ache', 'hurt', 'sore', 'discomfort', 'agony'],
            'headache': ['head pain', 'migraine', 'cephalgia'],
            'stomach': ['belly', 'abdomen', 'gastric', 'tummy'],
            'joint': ['knee', 'elbow', 'shoulder', 'hip', 'ankle', 'wrist'],
            'skin': ['dermal', 'cutaneous', 'epidermis'],
            'breathing': ['respiratory', 'lung', 'pulmonary'],
            'heart': ['cardiac', 'cardiovascular'],
            'mental': ['psychological', 'psychiatric', 'emotional']
          };
          
          let expandedSymptoms = symptoms.toLowerCase()
            .replace(/[^a-z\s,]/g, '')
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length >= 3);
          
          // Add synonyms for better matching
          const originalSymptoms = [...expandedSymptoms];
          originalSymptoms.forEach(symptom => {
            Object.entries(synonymMap).forEach(([key, syns]) => {
              if (symptom.includes(key) || syns.some(syn => symptom.includes(syn))) {
                expandedSymptoms.push(key, ...syns);
              }
            });
          });
          expandedSymptoms = [...new Set(expandedSymptoms)];
          
          const matchedDoctors = results.data
            .filter(doctor => doctor.vaidya_name && doctor.symptoms)
            .map(doctor => {
              const doctorSymptoms = doctor.symptoms.toLowerCase().split(',').map(s => s.trim());
              
              let exactMatches = 0;
              let strongMatches = 0;
              let partialMatches = 0;
              let totalRelevance = 0;
              const matchedSymptomsList = [];
              
              // Advanced matching with weighted scoring
              originalSymptoms.forEach(ps => {
                let bestMatch = 0;
                let matchedSymptom = '';
                
                doctorSymptoms.forEach(ds => {
                  let score = 0;
                  
                  // Exact match (highest priority)
                  if (ps === ds) {
                    score = 5;
                    exactMatches++;
                  }
                  // Word boundary exact match
                  else if (new RegExp(`\\b${ps}\\b`).test(ds) || new RegExp(`\\b${ds}\\b`).test(ps)) {
                    score = 4;
                    strongMatches++;
                  }
                  // Substring match with length consideration
                  else if (ps.length >= 4 && ds.includes(ps)) {
                    score = 3 * (ps.length / ds.length);
                    partialMatches++;
                  }
                  // Reverse substring
                  else if (ds.length >= 4 && ps.includes(ds)) {
                    score = 2.5 * (ds.length / ps.length);
                    partialMatches++;
                  }
                  // Fuzzy similarity
                  else if (ps.length >= 4 && ds.length >= 4) {
                    const similarity = calculateSimilarity(ps, ds);
                    if (similarity > 0.75) {
                      score = 2 * similarity;
                      partialMatches++;
                    }
                  }
                  
                  if (score > bestMatch) {
                    bestMatch = score;
                    matchedSymptom = ds;
                  }
                });
                
                if (bestMatch > 0) {
                  totalRelevance += bestMatch;
                  matchedSymptomsList.push(matchedSymptom);
                }
              });
              
              // Advanced scoring algorithm
              const symptomCoverage = originalSymptoms.length > 0 ? 
                (exactMatches + strongMatches + partialMatches) / originalSymptoms.length : 0;
              
              // Weighted match score
              const weightedScore = (exactMatches * 5 + strongMatches * 3 + partialMatches * 1) / 
                (originalSymptoms.length * 5);
              
              // Bonus calculations
              let bonusScore = 0;
              if (exactMatches >= 3) bonusScore += 30;
              else if (exactMatches >= 2) bonusScore += 20;
              else if (exactMatches >= 1) bonusScore += 10;
              
              // Penalty for too many symptoms without matches
              const unmatchedPenalty = Math.max(0, (originalSymptoms.length - (exactMatches + strongMatches)) * 5);
              
              const finalScore = Math.max(0, Math.min(100, 
                (weightedScore * 100) + bonusScore - unmatchedPenalty
              ));
              
              return {
                ...doctor,
                exactMatches,
                strongMatches,
                partialMatches,
                totalMatches: exactMatches + strongMatches + partialMatches,
                symptomCoverage,
                finalScore: Math.round(finalScore),
                relevanceScore: totalRelevance,
                matchedSymptoms: matchedSymptomsList
              };
            })
            .filter(doctor => doctor.totalMatches > 0 && doctor.finalScore >= 15)
            .sort((a, b) => {
              // Multi-tier sorting for maximum accuracy
              if (b.exactMatches !== a.exactMatches) return b.exactMatches - a.exactMatches;
              if (Math.abs(b.finalScore - a.finalScore) > 10) return b.finalScore - a.finalScore;
              if (b.strongMatches !== a.strongMatches) return b.strongMatches - a.strongMatches;
              if (Math.abs(b.symptomCoverage - a.symptomCoverage) > 0.2) return b.symptomCoverage - a.symptomCoverage;
              return b.relevanceScore - a.relevanceScore;
            })
            .slice(0, 5);
          
          // Add similarity calculation function
          function calculateSimilarity(str1, str2) {
            const longer = str1.length > str2.length ? str1 : str2;
            const shorter = str1.length > str2.length ? str2 : str1;
            if (longer.length === 0) return 1.0;
            return (longer.length - levenshteinDistance(longer, shorter)) / longer.length;
          }
          
          function levenshteinDistance(str1, str2) {
            const matrix = [];
            for (let i = 0; i <= str2.length; i++) matrix[i] = [i];
            for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;
            for (let i = 1; i <= str2.length; i++) {
              for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                  matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                  matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                  );
                }
              }
            }
            return matrix[str2.length][str1.length];
          }
          
          setDoctors(matchedDoctors);
          setShowDoctors(true);
          setIsLoading(false);
        },
        error: (error) => {
          setError('Error loading doctor data');
          setIsLoading(false);
        }
      });
    } catch (err) {
      setError('Unable to load doctor data. Please try again.');
      setIsLoading(false);
    }
  };

  if (showDoctors) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <button
              onClick={() => {
                setShowDoctors(false);
                setSymptoms('');
                setDoctors([]);
              }}
              className="group flex items-center space-x-2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200/50"
            >
              <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              <span>Search Again</span>
            </button>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Recommended Doctors</h2>
                  <p className="text-blue-100">AI-matched specialists based on your symptoms</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              {doctors.length > 0 ? (
                <div className="grid gap-6">
                  <AnimatePresence>
                    {doctors.map((doctor, index) => (
                      <motion.div
                        key={doctor.id || index}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="group bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <User className="w-8 h-8 text-white" />
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {doctor.vaidya_name}
                                </h3>
                                <p className="text-purple-600 font-semibold text-lg">{doctor.panchakarma}</p>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                              <p className="text-gray-700 font-medium">
                                <span className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Specializes in:</span>
                                <br />
                                {doctor.symptoms}
                              </p>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3 flex-wrap gap-2">
                                {doctor.exactMatches > 0 && (
                                  <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold"
                                  >
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <span>{doctor.exactMatches} Exact Match{doctor.exactMatches > 1 ? 'es' : ''}</span>
                                  </motion.span>
                                )}
                                {doctor.strongMatches > 0 && (
                                  <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold"
                                  >
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span>{doctor.strongMatches} Strong</span>
                                  </motion.span>
                                )}
                                {doctor.partialMatches > 0 && (
                                  <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center space-x-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold"
                                  >
                                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                    <span>{doctor.partialMatches} Partial</span>
                                  </motion.span>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${doctor.finalScore}%` }}
                                    transition={{ duration: 1, delay: 0.3 }}
                                    className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 h-full rounded-full"
                                  />
                                </div>
                                <span className="text-lg font-bold text-gray-800 min-w-[60px]">{doctor.finalScore}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              // Navigate to doctor detail page for appointment booking
                              navigate(`/doctor-info/${doctor.id || index}`, { 
                                state: { 
                                  doctor: {
                                    ...doctor,
                                    username: doctor.username // Ensure username is passed
                                  }, 
                                  symptoms 
                                } 
                              });
                            }}
                            className="group/btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ml-6"
                          >
                            <span className="flex items-center space-x-2">
                              <span>View Vaidya Description</span>
                              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </span>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Doctors Found</h3>
                  <p className="text-gray-600 text-lg">Try different symptoms or check your spelling</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-2xl">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Find Your Perfect Doctor
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered symptom analysis to match you with the right Ayurvedic specialist
          </p>
        </motion.div>

        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Symptom Analysis</h2>
                <p className="text-blue-100">Describe what you're experiencing</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700 font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Describe Your Symptoms *
            </label>
            <div className="relative">
              <textarea
                value={symptoms}
                onChange={(e) => {
                  setSymptoms(e.target.value);
                  const lastWord = e.target.value.split(',').pop().trim().toLowerCase();
                  if (lastWord.length >= 2) {
                    const filtered = commonSymptoms.filter(symptom => 
                      symptom.includes(lastWord) && !symptoms.includes(symptom)
                    ).slice(0, 6);
                    setSuggestions(filtered);
                    setShowSuggestions(filtered.length > 0);
                  } else {
                    setShowSuggestions(false);
                  }
                }}
                onFocus={() => {
                  if (symptoms.length === 0) {
                    setSuggestions(commonSymptoms.slice(0, 8));
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Start typing symptoms or click suggestions below (e.g., headache, fever, stomach pain)"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="4"
                disabled={isLoading}
                maxLength="500"
              />
              
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl z-10 mt-2 max-h-48 overflow-y-auto"
                  >
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-3 font-semibold flex items-center space-x-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Suggested symptoms:</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => {
                              const allSymptoms = symptoms.split(',').map(s => s.trim()).filter(s => s);
                              const completeSymptoms = allSymptoms.slice(0, -1);
                              if (!completeSymptoms.includes(suggestion)) {
                                const newSymptoms = [...completeSymptoms, suggestion].join(', ');
                                setSymptoms(newSymptoms + (newSymptoms ? ', ' : ''));
                              }
                              setShowSuggestions(false);
                            }}
                            className="text-sm bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-blue-700 px-3 py-2 rounded-lg border border-blue-200 transition-all duration-200 font-medium"
                          >
                            + {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Quick symptom categories */}
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2 font-medium">Quick categories:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Pain', symptoms: ['headache', 'joint pain', 'back pain'] },
                  { label: 'Digestive', symptoms: ['stomach pain', 'acidity', 'constipation'] },
                  { label: 'Respiratory', symptoms: ['cough', 'asthma', 'breathing problems'] },
                  { label: 'Mental Health', symptoms: ['stress', 'anxiety', 'depression'] },
                  { label: 'Skin', symptoms: ['acne', 'eczema', 'rash'] }
                ].map((category, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      const currentSymptoms = symptoms.split(',').map(s => s.trim()).filter(s => s);
                      const newSymptoms = category.symptoms.filter(s => !currentSymptoms.includes(s));
                      if (newSymptoms.length > 0) {
                        const allSymptoms = [...currentSymptoms, ...newSymptoms].join(', ');
                        setSymptoms(allSymptoms);
                      }
                    }}
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg transition-colors"
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-right text-sm text-gray-500 mt-1">
              {symptoms.length}/500
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || !symptoms.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-8 rounded-xl font-bold text-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-2xl disabled:shadow-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-3">
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Analyzing Symptoms...</span>
                </>
              ) : (
                <>
                  <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>Find My Doctor</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AppointmentBooking;