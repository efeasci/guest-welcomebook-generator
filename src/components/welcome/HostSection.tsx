import { User, Mail, Phone } from "lucide-react";

interface HostSectionProps {
  name?: string;
  about?: string;
  email?: string;
  phone?: string;
}

const HostSection = ({ name, about, email, phone }: HostSectionProps) => {
  if (!name && !about && !email && !phone) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <User className="h-5 w-5 text-primary" /> Your Host
      </h2>
      <div className="bg-secondary/50 p-4 rounded-lg space-y-4">
        {name && (
          <div>
            <p className="font-semibold">Name</p>
            <p>{name}</p>
          </div>
        )}
        {about && (
          <div>
            <p className="font-semibold">About</p>
            <p>{about}</p>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <a href={`mailto:${email}`} className="text-primary hover:underline">
              {email}
            </a>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <a href={`tel:${phone}`} className="text-primary hover:underline">
              {phone}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default HostSection;