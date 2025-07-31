import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { Save } from 'lucide-react';
import AvatarUpload from '@/components/people-tab/avatar-upload';
import PersonFormFields from '@/components/people-tab/person-form-fields';
import PersonPreview from '@/components/people-tab/person-preview';
import { peopleService, uploadService, type PersonInput } from '@/services/api';
import { runWithLoaderAndError } from '@/lib/utils';
import { useLookupStore } from '@/store/useLookupStore';

const AddPerson = () => {
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    avatar: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const personInput: PersonInput = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      avatarId: '',
      description: formData.description,
    };

    runWithLoaderAndError(
      async () => {
        if (avatarFile) {
          const uploadResponse = await uploadService.uploadAvatar(avatarFile, 'person');
          personInput.avatarId = uploadResponse.data.id;
        }

        await peopleService.create(personInput);
        await useLookupStore.getState().fetchPeople();
        navigate('/people', { replace: true });
      },
      {
        loaderMessage: 'Creating person...',
        successMessage: 'Person created successfully',
      },
    );
  };

  const handleAvatarChange = (avatarFile: File | null, avatarUrl: string | null) => {
    setAvatarFile(avatarFile);
    setAvatarUrl(avatarUrl);
  };

  return (
    <TabsLayout
      header={{
        title: 'Add Person',
        description: 'Add a new person to your contacts',
        linkBackward: '/people',
      }}
    >
      <div className="mx-auto flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Person Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <AvatarUpload avatar={avatarUrl || ''} name={formData.name} onAvatarChange={handleAvatarChange} />

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
                avatar={avatarUrl || ''}
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
