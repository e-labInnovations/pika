import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { Save } from 'lucide-react';
import AvatarUpload from '@/components/people-tab/avatar-upload';
import PersonFormFields from '@/components/people-tab/person-form-fields';
import PersonPreview from '@/components/people-tab/person-preview';

const AddPerson = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    avatar: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement person creation logic
    console.log('Creating person:', formData);
    navigate('/people');
  };

  return (
    <TabsLayout
      header={{
        title: 'Add Person',
        description: 'Add a new person to your contacts',
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

        <Button className="w-full" onClick={handleSubmit} disabled={!formData.name.trim()}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </TabsLayout>
  );
};

export default AddPerson;
