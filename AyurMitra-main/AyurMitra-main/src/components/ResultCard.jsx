import React from "react";

const ResultCard = ({ data }) => {
  return (
    <div className="p-4 border rounded shadow">
      <h3 className="text-xl font-semibold mb-2">Prediction Result</h3>
      <p>
        <strong>Input:</strong> {data.input}
      </p>
      <p>
        <strong>Predicted Dosha:</strong> {data.predicted_dosha}
      </p>
      <p>
        <strong>Therapy:</strong> {data.recommendations.therapy}
      </p>
      <p>
        <strong>Herbs:</strong> {data.recommendations.herbs.join(", ")}
      </p>
      <p>
        <strong>Lifestyle:</strong> {data.recommendations.lifestyle.join(", ")}
      </p>
    </div>
  );
};

export default ResultCard;
