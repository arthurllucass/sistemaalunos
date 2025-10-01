import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  User,
  LogOut,
  GraduationCap,
  Shield,
  BookOpen,
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

const AppSidebar = () => {
  const { profile, isAdmin, isProfessor, isAluno, signOut } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const getNavClass = (isActive: boolean) =>
    isActive
      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
      : 'hover:bg-sidebar-accent/50';

  const menuItems = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, show: true },
    { title: 'Alunos', url: '/alunos', icon: Users, show: isAdmin || isProfessor },
    { title: 'Meu Perfil', url: '/perfil', icon: User, show: isAluno },
  ];

  const getRoleIcon = () => {
    if (isAdmin) return <Shield className="w-4 h-4" />;
    if (isProfessor) return <BookOpen className="w-4 h-4" />;
    return <GraduationCap className="w-4 h-4" />;
  };

  const getRoleLabel = () => {
    if (isAdmin) return 'Administrador';
    if (isProfessor) return 'Professor';
    return 'Aluno';
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="p-2 rounded-lg bg-sidebar-primary/10">
            <GraduationCap className="w-6 h-6 text-sidebar-primary" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-sidebar-foreground">Sistema de Alunos</h2>
              <p className="text-xs text-sidebar-foreground/60">Gestão Educacional</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems
                .filter((item) => item.show)
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) => getNavClass(isActive)}
                      >
                        <item.icon className="w-4 h-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                  {profile?.nome?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-sidebar-foreground">
                  {profile?.nome}
                </p>
                <div className="flex items-center gap-1 text-xs text-sidebar-foreground/60">
                  {getRoleIcon()}
                  <span>{getRoleLabel()}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={signOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="w-full"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
