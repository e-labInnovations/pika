import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { Save, Trash2 } from 'lucide-react';
import AvatarUpload from '@/components/people-tab/avatar-upload';
import PersonFormFields from '@/components/people-tab/person-form-fields';
import PersonPreview from '@/components/people-tab/person-preview';
import { peopleService, uploadService, type Person, type PersonInput } from '@/services/api';
import { toast } from 'sonner';
import { runWithLoaderAndError } from '@/lib/utils';
import { useLookupStore } from '@/store/useLookupStore';
import { useConfirmDialog } from '@/store/useConfirmDialog';

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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      peopleService
        .get(id)
        .then((response) => {
          setPerson(response.data);
          setFormData({
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
            description: response.data.description,
            avatar: '',
          });
          setAvatarUrl(response.data.avatar.url);
          setAvatarFile(null);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  }, [id, navigate]);

  const handleAvatarChange = (avatarFile: File | null, avatarUrl: string | null) => {
    setAvatarFile(avatarFile);
    setAvatarUrl(avatarUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const personInput: PersonInput = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      avatarId: person?.avatar.id || '',
      description: formData.description,
    };

    runWithLoaderAndError(
      async () => {
        if (avatarFile) {
          const uploadResponse = await uploadService.uploadAvatar(avatarFile, 'person');
          personInput.avatarId = uploadResponse.data.id;
        }
        await peopleService.update(id as string, personInput);
        useLookupStore.getState().fetchPeople();
        navigate(`/people/${id}`, { replace: true });
      },
      {
        loaderMessage: 'Updating person...',
        successMessage: 'Person updated successfully',
      },
    );
  };

  const handleDelete = () => {
    useConfirmDialog.getState().open({
      title: 'Delete Person',
      message: `Are you sure you want to delete "${formData.name}"?`,
      onConfirm: () => {
        runWithLoaderAndError(
          async () => {
            await peopleService.delete(id as string);
            useLookupStore.getState().fetchPeople();
            navigate('/people', { replace: true });
          },
          {
            loaderMessage: 'Deleting person...',
            successMessage: 'Person deleted successfully',
          },
        );
      },
    });
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
