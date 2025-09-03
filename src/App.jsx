import { useState, useEffect } from 'react';
import axios from 'axios';
import TemplateForm from './components/TemplateForm';
import './App.css';

const API_URL = 'http://localhost:5000/api/templates'; 

function App() {
  const [templates, setTemplates] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Fetch templates from the API
  const fetchTemplates = async () => {
    try {
      const response = await axios.get(API_URL);
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Handle template creation
  const handleCreateTemplate = async (newTemplate) => {
    try {
      await axios.post(API_URL, newTemplate);
      fetchTemplates();
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  // Handle template update
  const handleUpdateTemplate = async (updatedTemplate) => {
    try {
      await axios.put(`${API_URL}/${updatedTemplate._id}`, updatedTemplate);
      setEditingTemplate(null);
      fetchTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  // Handle template deletion
  const handleDeleteTemplate = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Template Management
        </h1>
        <TemplateForm
          onSubmit={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
          initialData={editingTemplate}
          buttonText={editingTemplate ? 'Update Template' : 'Create Template'}
        />
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Templates List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <div key={template._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-600"><strong>Type:</strong> {template.type}</p>
                <p className="mt-2 text-gray-800">{template.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Author:</strong> {template.author} | <strong>Labels:</strong> {template.labels.join(', ') || 'None'}
                </p>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setEditingTemplate(template)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
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

export default App;
