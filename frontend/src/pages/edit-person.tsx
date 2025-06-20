import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { Save, Trash2 } from 'lucide-react';
import { people, type Person } from '@/data/dummy-data';
import AvatarUpload from '@/components/people-tab/avatar-upload';
import PersonFormFields from '@/components/people-tab/person-form-fields';
import PersonPreview from '@/components/people-tab/person-preview';

const EditPerson = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    avatar: '',
  });

  const [person, setPerson] = useState<Person | null>(null);

  useEffect(() => {
    if (id) {
      // Find the person in the people array
      const foundPerson = people.find((person) => person.id === id);
      if (foundPerson) {
        setPerson(foundPerson);
        setFormData({
          name: foundPerson.name,
          email: foundPerson.email,
          phone: foundPerson.phone,
          description: foundPerson.description,
          avatar: foundPerson.avatar || '',
        });
      } else {
        navigate('/people');
      }
    }
  }, [id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement person update logic
    console.log('Updating person:', { ...formData, id });
    navigate('/people');
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${formData.name}"?`)) {
      // TODO: Implement person deletion logic
      console.log('Deleting person:', id);
      navigate('/people');
    }
  };

  if (!person) {
    return (
      <TabsLayout
        header={{
          title: 'Edit Person',
          description: 'Person not found',
          linkBackward: '/people',
        }}
      >
        <div className="py-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">Person not found</p>
        </div>
      </TabsLayout>
    );
  }

  return (
    <TabsLayout
      header={{
        title: 'Edit Person',
        description: 'Update person information',
        linkBackward: '/people',
      }}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Person Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <AvatarUpload
                avatar={formData.avatar}
                name={formData.name}
                onAvatarChange={(avatar) => setFormData((prev) => ({ ...prev, avatar }))}
              />

              <PersonFormFields
                name={formData.name}
                email={formData.email}
                phone={formData.phone}
                description={formData.description}
                onNameChange={(name) => setFormData((prev) => ({ ...prev, name }))}
                onEmailChange={(email) => setFormData((prev) => ({ ...prev, email }))}
                onPhoneChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
                onDescriptionChange={(description) => setFormData((prev) => ({ ...prev, description }))}
              />

              <PersonPreview
                name={formData.name}
                email={formData.email}
                phone={formData.phone}
                description={formData.description}
                avatar={formData.avatar}
              />
            </form>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button variant="destructive" onClick={handleDelete} className="w-1/2">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.name.trim()} className="w-1/2">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    </TabsLayout>
  );
};

export default EditPerson;
