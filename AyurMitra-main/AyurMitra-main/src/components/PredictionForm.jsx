"use client";
import React, { useState, useEffect } from "react";
import { recommendations } from "../data/recommendations";
import ResultCard from "./ResultCard";
import { Loader2, Trash2, Sparkles, Bot } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";

const MAX_CHARS = 1200;

const PredictionForm = () => {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getPrediction = (symptoms) => {
    const symptomMap = {
        'pitta': ['burning', 'inflammation', 'heat', 'acidity', 'indigestion', 'ulcer', 'irritable', 'diarrhea', 'skin rash', 'thirst', 'anger', 'frustration', 'irritability'],
        'vata': ['pain', 'bodypain', 'chestpain', 'body pain', 'headache', 'stiffness', 'fatigue', 'anxiety', 'insomnia', 'dry', 'constipation', 'gas', 'bloating', 'cracking', 'joint'],
        'kapha': ['congestion', 'mucus', 'heavy', 'lethargy', 'weight gain', 'oily', 'sluggish', 'depression', 'water retention', 'cold', 'cough'],
        'digestive-imbalance': ['digestive', 'indigestion', 'gas', 'bloating', 'constipation', 'diarrhea', 'acidity', 'stomach', 'nausea'],
        'stress-related': ['stress', 'anxiety', 'tension', 'irritability', 'insomnia', 'fatigue', 'overwhelm'],
        'skin-disorders': ['skin', 'rash', 'eczema', 'psoriasis', 'acne', 'inflammation', 'itchy'],
        'respiratory-imbalance': ['respiratory', 'breathing', 'cough', 'asthma', 'congestion', 'wheezing'],
        'obesity': ['obesity', 'weight', 'overweight'],
        'diabetes': ['diabetes', 'sugar', 'thirst', 'urination'],
        'hypertension': ['hypertension', 'blood pressure', 'dizzy'],
        'arthritis': ['arthritis', 'joint', 'pain', 'stiffness', 'inflammation'],
        'migraine': ['migraine', 'headache'],
        'hair-fall': ['hair', 'hairfall', 'balding'],
        'dandruff': ['dandruff', 'flaky', 'scalp']
    };

    const scores = {};
    const lowerCaseSymptoms = symptoms.toLowerCase();

    if (!lowerCaseSymptoms.trim()) {
      return null;
    }

    // Initialize scores
    Object.keys(recommendations).forEach(key => scores[key] = 0);

    // Scoring based on symptomMap
    for (const dosha in symptomMap) {
        symptomMap[dosha].forEach(keyword => {
            if (lowerCaseSymptoms.includes(keyword)) {
                scores[dosha] = (scores[dosha] || 0) + 2; // Higher weight for symptom keywords
            }
        });
    }
    
    // Original scoring logic as a supplement
    for (const key in recommendations) {
      const recommendation = recommendations[key];

      if (lowerCaseSymptoms.includes(key.split('-').join(' '))) {
        scores[key] = (scores[key] || 0) + 2;
      }

      recommendation.herbs.forEach(herb => {
        if (lowerCaseSymptoms.includes(herb)) {
          scores[key] = (scores[key] || 0) + 1;
        }
      });

      recommendation.lifestyle.forEach(style => {
        if (lowerCaseSymptoms.includes(style)) {
            scores[key] = (scores[key] || 0) + 1;
        }
      });
      
      if (lowerCaseSymptoms.includes(recommendation.therapy)) {
          scores[key] = (scores[key] || 0) + 1;
      }
    }

    let predicted_dosha = null;
    let maxScore = 0;
    for (const key in scores) {
      if (scores[key] > maxScore) {
        maxScore = scores[key];
        predicted_dosha = key;
      }
    }
    
    if (predicted_dosha && maxScore >= 2) { // Lowered confidence threshold
      return {
        input: symptoms,
        predicted_dosha: predicted_dosha,
        recommendations: recommendations[predicted_dosha]
      };
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setError("");
    const payload = symptoms.trim();
    if (!payload) {
      setError("Please enter some symptoms to predict.");
      return;
    }
    try {
      setLoading(true);
      setResult(null); // Clear previous results
      
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

      const predictionResult = getPrediction(payload);

      if (predictionResult) {
        setResult(predictionResult);
      } else {
        setError("Could not determine a dosha based on the provided symptoms. Please try to be more descriptive.");
      }

    } catch (err) {
      console.error(err);
      setError(err?.message || "Prediction failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSymptoms("");
    setResult(null);
    setError("");
  };

  // Keyboard shortcut: Ctrl+Enter
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [symptoms]);

  const sampleSymptoms = [
    "💪 joint pain, stiffness, fatigue",
    "🥗 digestive issues, bloating",
    "😴 insomnia, anxiety",
    "🌡️ skin inflammation, heat sensations",
  ];

  const handleSampleClick = (symptom) => {
    const symptomText = symptom.replace(/^.+?\s/, ""); // remove emoji
    setSymptoms((prev) =>
      prev ? `${prev.trim()}, ${symptomText}` : symptomText
    );
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <CardHeader>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
          <Bot />
          Panchakarma Dosha Predictor
        </CardTitle>
        <p className="text-sm text-gray-500 leading-relaxed mt-1">
          Enter symptoms to get a predicted <strong>dominant dosha</strong> and
          supportive recommendations. This is not a medical diagnosis.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea
              id="symptoms"
              aria-label="Patient symptoms"
              className="w-full p-4 rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-emerald-400 transition resize-none bg-white"
              rows={5}
              value={symptoms}
              maxLength={MAX_CHARS}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. persistent joint pain, poor digestion, low energy..."
            />
            <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-400">
                    For best results, be descriptive.
                </p>
                <p className="text-xs text-gray-500">
                    {symptoms.length} / {MAX_CHARS}
                </p>
            </div>
          </div>

          {/* Sample symptoms */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Or select from common symptoms:</p>
            <div className="flex flex-wrap gap-2">
              {sampleSymptoms.map((s) => (
                <Badge
                  key={s}
                  onClick={() => handleSampleClick(s)}
                  variant="outline"
                  className="cursor-pointer hover:bg-emerald-100 transition-colors"
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={!symptoms.trim() || loading}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? 'Predicting...' : 'Predict Dosha'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleClear}
              disabled={loading}
              className="inline-flex items-center text-gray-600 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-1" /> Clear
            </Button>

            <span className="ml-auto text-xs text-gray-400">Ctrl+Enter</span>
          </div>
        </form>

        {/* Results */}
        <div className="mt-8">
          {loading && (
             <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-xl bg-gray-50/50">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
                <p className="text-gray-600 font-medium">Analyzing symptoms...</p>
                <p className="text-sm text-gray-500">This will just take a moment.</p>
             </div>
          )}
          
          <div
            className={`transition-all duration-500 ease-in-out ${
              result ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
            aria-live="polite"
          >
            {result && (
              <div className="backdrop-blur-md bg-white/70 shadow-xl rounded-2xl p-4 mt-6">
                <ResultCard data={result} />
              </div>
            )}
          </div>

          {!loading && !result && (
            <div className="text-center p-10 border-2 border-dashed rounded-xl bg-gray-50/50">
                <Bot className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                <h3 className="font-medium text-gray-700">Prediction will appear here</h3>
                <p className="text-sm text-gray-500 mt-1">Enter your symptoms above to get started.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;
