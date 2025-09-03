import React, { useState, useEffect } from 'react';

const TemplateForm = ({ onSubmit, initialData = null, buttonText }) => {
  const [formData, setFormData] = useState({
    type: '',
    content: '',
    labels: '',
    author: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || '',
        content: initialData.content || '',
        labels: initialData.labels ? initialData.labels.join(', ') : '',
        author: initialData.author || '',
      });
    } else {
      setFormData({
        type: '',
        content: '',
        labels: '',
        author: '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const templateToSubmit = {
      ...formData,
      labels: formData.labels.split(',').map((label) => label.trim()).filter((label) => label !== ''),
    };
    if (initialData) {
      templateToSubmit._id = initialData._id;
    }
    onSubmit(templateToSubmit);
    setFormData({ type: '', content: '', labels: '', author: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-200 p-6 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Content</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 h-32"
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Labels (comma-separated)</label>
        <input
          type="text"
          name="labels"
          value={formData.labels}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default TemplateForm;
