import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface AgreementDialogProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  instructions: string;
}

const AgreementDialog = ({id, isOpen, onClose, instructions}: AgreementDialogProps) => {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Instructions</span>
          </DialogTitle>
        </DialogHeader>

        {instructions && (
          <div className="text-sm text-muted-foreground">
            <p>{instructions}</p>
          </div>
        )}
        <Agreement id={id} onClose={onClose} />        
      </DialogContent>
    </Dialog>
  );
};

export default AgreementDialog;

const Agreement = ({id, onClose}: {id: string, onClose: () => void}) => {
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (checked) {
      window.open(`/assesment/${id}`, '_blank');
      onClose();
    } else {
      setError("You must agree to the terms to continue.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Assessment Agreement</h2>
      <div className="text-sm text-muted-foreground">
        <p>
          Before you begin the assessment, please read and agree to the following terms:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>You will complete the assessment without external help.</li>
          <li>Your answers should reflect your own knowledge and skills.</li>
          <li>Do not refresh or close the browser during the assessment.</li>
          <li>All responses are final once submitted.</li>
        </ul>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="agreement-checkbox"
          checked={checked}
          onCheckedChange={(val) => {
            setChecked(!!val);
            setError("");
          }}
        />
        <label htmlFor="agreement-checkbox" className="text-sm cursor-pointer">
          I have read and agree to the terms above.
        </label>
      </div>
      {error && <div className="text-red-500 text-xs">{error}</div>}
      <Button
        className="w-full mt-2"
        onClick={handleContinue}
        disabled={!checked}
      >
        Continue
      </Button>
    </div>
  );
};
