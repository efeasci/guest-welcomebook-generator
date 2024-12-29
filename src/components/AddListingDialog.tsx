import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import ListingForm from "./ListingForm"
import type { ListingFormValues } from "@/schemas/listingSchema"
import { submitListing } from "@/utils/listingSubmission"

interface AddListingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AddListingDialog = ({ open, onOpenChange }: AddListingDialogProps) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleSubmit = async (values: ListingFormValues) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error("No user found")

      const data = await submitListing(values, user.id)
      
      toast({
        title: "Success",
        description: "Listing created successfully",
      })
      
      queryClient.invalidateQueries({ queryKey: ["listings"] })
      onOpenChange(false)
      
      if (data) {
        navigate(`/welcome/${data.id}`)
      }
    } catch (error) {
      console.error("Error creating listing:", error)
      toast({
        title: "Error",
        description: "Failed to create listing",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Listing</DialogTitle>
        </DialogHeader>
        <ListingForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

export default AddListingDialog