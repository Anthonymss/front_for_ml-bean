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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-gray-200">
      <h1 className="text-4xl font-extrabold mb-10 text-center tracking-wide">
        🌱 Clasificación de Frijol
      </h1>

      <div className="w-full max-w-lg bg-gray-800 rounded-3xl shadow-xl p-8 flex flex-col items-center gap-6">
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-700 rounded-xl bg-gray-900 text-gray-200 hover:border-green-500 transition"
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-64 h-64 object-cover border-2 border-gray-700 rounded-xl shadow-inner mt-2"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-green-500 text-black font-bold rounded-xl hover:bg-green-600 transition-shadow shadow-md"
          >
            {loading ? "Procesando..." : "Predecir"}
          </button>
        </form>

        {result && (
          <div className="w-full mt-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Resultado:{" "}
              <span
                className={`${
                  result.class_name === "healthy" ? "text-green-400" : "text-red-400"
                } font-bold`}
              >
                {result.class_name.toUpperCase()} ({(result.confidence * 100).toFixed(2)}%)
              </span>
            </h2>

            <div className="space-y-3">
              {Object.entries(result.all_probabilities).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-36 font-medium">{key}</span>
                  <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-4 rounded-full transition-all duration-500 ${
                        key === result.class_name ? "bg-green-500" : "bg-gray-600"
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
