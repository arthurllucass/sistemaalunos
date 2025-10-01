import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const alunoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  matricula: z.string().min(3, 'Matrícula deve ter no mínimo 3 caracteres').max(50),
  curso: z.string().min(3, 'Curso deve ter no mínimo 3 caracteres').max(100),
  email: z.string().email('Email inválido').max(255),
  status: z.enum(['ativo', 'inativo']),
});

type AlunoFormData = z.infer<typeof alunoSchema>;

interface AlunoFormProps {
  aluno?: {
    id: number;
    nome: string;
    matricula: string;
    curso: string;
    email: string;
    status: 'ativo' | 'inativo';
  } | null;
  onClose: () => void;
}

const AlunoForm = ({ aluno, onClose }: AlunoFormProps) => {
  const isEditing = !!aluno;

  const form = useForm<AlunoFormData>({
    resolver: zodResolver(alunoSchema),
    defaultValues: {
      nome: '',
      matricula: '',
      curso: '',
      email: '',
      status: 'ativo',
    },
  });

  useEffect(() => {
    if (aluno) {
      form.reset({
        nome: aluno.nome,
        matricula: aluno.matricula,
        curso: aluno.curso,
        email: aluno.email,
        status: aluno.status,
      });
    }
  }, [aluno, form]);

  const onSubmit = async (data: AlunoFormData) => {
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('alunos')
          .update(data)
          .eq('id', aluno.id);

        if (error) throw error;
        toast.success('Aluno atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('alunos')
          .insert([{
            nome: data.nome,
            matricula: data.matricula,
            curso: data.curso,
            email: data.email,
            status: data.status,
          }]);

        if (error) throw error;
        toast.success('Aluno cadastrado com sucesso!');
      }
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar aluno:', error);
      if (error.message?.includes('duplicate key')) {
        if (error.message.includes('matricula')) {
          toast.error('Matrícula já cadastrada');
        } else if (error.message.includes('email')) {
          toast.error('Email já cadastrado');
        } else {
          toast.error('Dados duplicados');
        }
      } else {
        toast.error(error.message || 'Erro ao salvar aluno');
      }
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Aluno' : 'Novo Aluno'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Atualize as informações do aluno'
                : 'Preencha os dados do novo aluno'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                placeholder="Nome do aluno"
                {...form.register('nome')}
              />
              {form.formState.errors.nome && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.nome.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula *</Label>
              <Input
                id="matricula"
                placeholder="Número de matrícula"
                {...form.register('matricula')}
              />
              {form.formState.errors.matricula && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.matricula.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="curso">Curso *</Label>
              <Input
                id="curso"
                placeholder="Nome do curso"
                {...form.register('curso')}
              />
              {form.formState.errors.curso && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.curso.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={form.watch('status')}
                onValueChange={(value) =>
                  form.setValue('status', value as 'ativo' | 'inativo')
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.status && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.status.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={form.formState.isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : isEditing ? (
                'Atualizar'
              ) : (
                'Cadastrar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AlunoForm;
