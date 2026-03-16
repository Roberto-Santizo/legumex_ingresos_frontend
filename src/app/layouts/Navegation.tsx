import {UserCog,User,UserLock,Building2,Building,PersonStanding, UserPlus,AlignEndHorizontal  } from "lucide-react";
import NavLinkComponent from "@/shared/components/NavLinkComponent";

export default function Navegation() {
  return (
    <div className="space-y-1.5">

        <NavLinkComponent url="/user" text="Usuarios">
          <User />
        </NavLinkComponent>

        <NavLinkComponent url="/role" text="Roles">
          <UserCog />
        </NavLinkComponent>

        <NavLinkComponent url="/report" text="Dashboard">
          <AlignEndHorizontal  />
        </NavLinkComponent>

        <NavLinkComponent url="/agent" text="Agentes">
          <UserLock  />
        </NavLinkComponent>

        <NavLinkComponent url="/company" text="Empresas">
          <Building2  />
        </NavLinkComponent>

        <NavLinkComponent url="/department" text="Departamento">
          <Building  />
        </NavLinkComponent>

        <NavLinkComponent url="/visitor" text="Visitantes">
          <UserPlus  />
        </NavLinkComponent>

        <NavLinkComponent url="/visits" text="Listado de visitas">
          <PersonStanding  />
        </NavLinkComponent>
    </div>
  );
}
