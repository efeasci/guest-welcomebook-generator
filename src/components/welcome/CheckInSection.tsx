import { Key } from "lucide-react";

interface CheckInSectionProps {
  checkIn: string;
  checkOut: string;
  checkInMethod?: string;
  checkInInstructions?: string;
}

const CheckInSection = ({ checkIn, checkOut, checkInMethod, checkInInstructions }: CheckInSectionProps) => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Key className="h-5 w-5 text-primary" /> Check-in Information
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary p-4 rounded-lg">
            <p className="font-semibold">Check-in</p>
            <p>{checkIn}</p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <p className="font-semibold">Check-out</p>
            <p>{checkOut}</p>
          </div>
        </div>
        {checkInMethod && (
          <div className="bg-secondary/50 p-4 rounded-lg">
            <p className="font-semibold">Check-in Method</p>
            <p>{checkInMethod}</p>
          </div>
        )}
        {checkInInstructions && (
          <div className="bg-secondary/50 p-4 rounded-lg">
            <p className="font-semibold">Check-in Instructions</p>
            <p className="whitespace-pre-wrap">{checkInInstructions}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CheckInSection;