"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await axios.post(
        "https://test-ml-api-rest.onrender.com/predict",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al predecir la imagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-8 text-green-800 text-center">
        Clasificación de Frijol 🌱
      </h1>

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-6">
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="p-2 border rounded-lg bg-white w-full"
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-64 h-64 object-cover border-4 border-green-300 rounded-xl shadow-lg"
            />
          )}
          <button
            type="submit"
            className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-green-700 transition w-full"
            disabled={loading}
          >
            {loading ? "Procesando..." : "Predecir"}
          </button>
        </form>

        {result && (
          <div className="w-full mt-6 space-y-4">
            <h2 className="text-2xl font-bold text-center">
              Resultado:{" "}
              <span
                className={`${
                  result.class_name === "healthy" ? "text-green-600" : "text-red-600"
                }`}
              >
                {result.class_name.toUpperCase()} ({(result.confidence * 100).toFixed(2)}%)
              </span>
            </h2>

            <div className="space-y-2">
              {Object.entries(result.all_probabilities).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="w-36 font-medium">{key}</span>
                  <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-4 rounded-full ${
                        key === result.class_name ? "bg-green-500" : "bg-gray-400"
                      }`}
                      style={{ width: `${(value * 100).toFixed(2)}%` }}
                    ></div>
                  </div>
                  <span className="w-12 text-right font-mono">
                    {(value * 100).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
