import { useState, useEffect } from 'react';
import axios from 'axios';
import TemplateForm from '../components/TemplateForm.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function Templates() {
  const [templates, setTemplates] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  // Fetch templates from the API
  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setTemplates(response.data);
    } catch (err) {
      setError('Failed to fetch templates. Please check the API connection.');
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const showFeedback = (message, type) => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
  };

  // Handle template creation
  const handleCreateTemplate = async (newTemplate) => {
    try {
      await axios.post(API_URL, newTemplate);
      showFeedback('Template created successfully!', 'success');
      fetchTemplates();
    } catch (error) {
      showFeedback('Error creating template.', 'error');
      console.error('Error creating template:', error);
    }
  };

  // Handle template update
  const handleUpdateTemplate = async (updatedTemplate) => {
    try {
      await axios.put(`${API_URL}/${updatedTemplate._id}`, updatedTemplate);
      setEditingTemplate(null);
      showFeedback('Template updated successfully!', 'success');
      fetchTemplates();
    } catch (error) {
      showFeedback('Error updating template.', 'error');
      console.error('Error updating template:', error);
    }
  };

  // Handle template deletion
  const handleDeleteTemplate = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      showFeedback('Template deleted successfully!', 'success');
      fetchTemplates();
    } catch (error) {
      showFeedback('Error deleting template.', 'error');
      console.error('Error deleting template:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Template Management
        </h1>

        {feedback.message && (
          <div className={`p-3 mb-4 text-center rounded-md ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {feedback.message}
          </div>
        )}

        <TemplateForm
          onSubmit={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
          initialData={editingTemplate}
          buttonText={editingTemplate ? 'Update Template' : 'Create Template'}
        />

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Templates List</h2>

          {loading && <p className="text-center text-gray-500">Loading templates...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && templates.length === 0 && !error && (
            <p className="text-center text-gray-500">No templates found. Create one above!</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-600 font-medium">Type: {template.type}</p>
                <p className="mt-2 text-gray-800">{template.content}</p>
                <div className="text-sm text-gray-500 mt-2">
                  <p>Author: {template.author}</p>
                  <p>Labels: {template.labels.join(', ') || 'None'}</p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setEditingTemplate(template)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template._id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Templates;
