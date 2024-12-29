import { Wifi } from "lucide-react";

interface WifiSectionProps {
  wifiNetwork?: string;
  wifiPassword?: string;
}

const WifiSection = ({ wifiNetwork, wifiPassword }: WifiSectionProps) => {
  if (!wifiNetwork && !wifiPassword) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Wifi className="h-5 w-5 text-primary" /> WiFi Information
      </h2>
      <div className="bg-secondary p-4 rounded-lg space-y-2">
        {wifiNetwork && (
          <div>
            <p className="text-sm text-muted-foreground">Network Name</p>
            <p className="font-mono text-lg">{wifiNetwork}</p>
          </div>
        )}
        {wifiPassword && (
          <div>
            <p className="text-sm text-muted-foreground">Password</p>
            <p className="font-mono text-lg">{wifiPassword}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default WifiSection;