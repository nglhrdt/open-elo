import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AnyFieldApi } from "@tanstack/react-form"

export function NumberField(field: AnyFieldApi) {
    return (
        <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="number">{field.name}</Label>
            <Input type="number" id="number" />
        </div>
    )
}
