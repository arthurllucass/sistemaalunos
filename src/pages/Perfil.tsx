import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, BookOpen, Hash, User as UserIcon } from 'lucide-react';

interface AlunoData {
  id: number;
  nome: string;
  matricula: string;
  curso: string;
  email: string;
  status: 'ativo' | 'inativo';
}

const Perfil = () => {
  const { profile, user } = useAuth();
  const [alunoData, setAlunoData] = useState<AlunoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlunoData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('alunos')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setAlunoData(data);
      } catch (error) {
        console.error('Erro ao buscar dados do aluno:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlunoData();
  }, [user]);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Visualize suas informações pessoais e acadêmicas
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>Seus dados cadastrais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nome Completo
                </label>
                <p className="text-lg font-medium">{profile?.nome}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-lg font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {profile?.email}
                </p>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <Card className="shadow-md animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ) : alunoData ? (
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-accent" />
                      Informações Acadêmicas
                    </CardTitle>
                    <CardDescription>Seus dados como aluno</CardDescription>
                  </div>
                  <Badge
                    variant={alunoData.status === 'ativo' ? 'default' : 'secondary'}
                    className={
                      alunoData.status === 'ativo'
                        ? 'bg-success text-success-foreground'
                        : ''
                    }
                  >
                    {alunoData.status === 'ativo' ? 'Matrícula Ativa' : 'Matrícula Inativa'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Matrícula
                  </label>
                  <p className="text-lg font-medium">{alunoData.matricula}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Curso
                  </label>
                  <p className="text-lg font-medium">{alunoData.curso}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-md">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Você ainda não está vinculado a nenhum registro de aluno.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Entre em contato com a administração para mais informações.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
