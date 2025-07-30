import React, { useState } from "react";
import { shortenUrls } from "../api/shorten";
import logger from "../middleware/logger";
import { validateEntry } from "../utills/validator";
import ShortenerList from "./shortenerlist";

const MAX_URLS = 5;

const ShortenerForm = () => {
  const [entries, setEntries] = useState([
    { url: "", validity: "", shortcode: "" },
  ]);
  const [shortened, setShortened] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const addUrlField = () => {
    if (entries.length < MAX_URLS) {
      setEntries([...entries, { url: "", validity: "", shortcode: "" }]);
    }
  };

  const removeUrlField = (index) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allErrors = entries.map(validateEntry);
    const hasErrors = allErrors.some((error) => Object.keys(error).length > 0);
    if (hasErrors) {
      logger.warn("Validation failed", { allErrors });
      alert("Validation failed. Please check your input fields.");
      return;
    }

    logger.info("Form submitted with entries", { entries });

    try {
      const result = await shortenUrls(entries);
      setShortened(result);
      logger.debug("Shortened result:", { result });

      const newShortcodes = result.map((item) =>
        item.shortlink.split("/").pop()
      );
      const existing = JSON.parse(localStorage.getItem("shortcodes") || "[]");
      const combined = [...new Set([...existing, ...newShortcodes])];
      localStorage.setItem("shortcodes", JSON.stringify(combined));
    } catch (err) {
      logger.error("Failed to shorten URLs", { error: err });
      alert("Failed to shorten URLs. Check logs for details.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        URL Shortener
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-4">
        {entries.map((entry, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 space-y-4 border border-gray-200"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="url"
                placeholder="Original URL"
                className="col-span-1 sm:col-span-1 text-black border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={entry.url}
                required
                onChange={(e) => handleChange(index, "url", e.target.value)}
              />
              <input
                type="number"
                placeholder="Validity (minutes)"
                className="border border-gray-300 text-black rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={entry.validity}
                onChange={(e) =>
                  handleChange(index, "validity", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Preferred Shortcode"
                className="border border-gray-300 text-black rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={entry.shortcode}
                onChange={(e) =>
                  handleChange(index, "shortcode", e.target.value)
                }
              />
            </div>

            {entries.length > 1 && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => removeUrlField(index)}
                  className="text-red-600 border border-red-500 px-4 py-1 rounded-md hover:bg-red-100 transition"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}

        {entries.length < MAX_URLS && (
          <div className="text-center">
            <button
              type="button"
              onClick={addUrlField}
              className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
            >
              + Add Another URL
            </button>
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-500 transition"
          >
            Shorten URLs
          </button>
        </div>

        <ShortenerList urls={shortened} />
      </form>
    </div>
  );
};

export default ShortenerForm;
