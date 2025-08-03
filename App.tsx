import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import LoanForm from './components/LoanForm';
import DataAnalysis from './components/DataAnalysis';
import ModelMetricsComponent from './components/ModelMetrics';
import DatasetView from './components/DatasetView';
import { LoanApplication, PredictionResult, ModelMetrics } from './types/loan';
import { loanModel } from './utils/mlModel';
import { sampleLoanData } from './data/sampleData';

function App() {
  const [activeTab, setActiveTab] = useState('predict');
  const [applications, setApplications] = useState<LoanApplication[]>(sampleLoanData);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics | null>(null);

  // Train the model and calculate metrics on component mount
  useEffect(() => {
    // Train the model with sample data
    loanModel.train(sampleLoanData);
    
    // Calculate initial metrics
    const metrics = loanModel.evaluate(sampleLoanData);
    setModelMetrics(metrics);
  }, []);

  const handlePredict = (application: LoanApplication): PredictionResult => {
    return loanModel.predict(application);
  };

  const handleSaveApplication = (application: LoanApplication) => {
    setApplications(prev => [...prev, application]);
    
    // Retrain model with new data and update metrics
    const updatedData = [...applications, application];
    loanModel.train(updatedData);
    const metrics = loanModel.evaluate(updatedData);
    setModelMetrics(metrics);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'predict':
        return (
          <LoanForm 
            onPredict={handlePredict}
            onSave={handleSaveApplication}
          />
        );
      case 'analysis':
        return <DataAnalysis data={applications} />;
      case 'model':
        return modelMetrics ? (
          <ModelMetricsComponent metrics={modelMetrics} />
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-500">Loading model metrics...</p>
          </div>
        );
      case 'dataset':
        return <DatasetView data={applications} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Loan Approval Prediction System
          </h1>
          <p className="text-lg text-gray-600">
            Advanced machine learning-powered loan approval prediction with comprehensive data analysis
          </p>
        </div>

        {renderContent()}
      </main>
    </div>
  );
}

export default App;