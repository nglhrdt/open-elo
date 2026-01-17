import { getTokens, revokeToken } from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Check, Copy, Trash2 } from "lucide-react";
import { useState } from "react";

export function TokenList() {
  const queryClient = useQueryClient();
  const { data: tokens } = useQuery({ queryKey: ['tokens'], queryFn: getTokens });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const revokeMutation = useMutation({
    mutationFn: revokeToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
    },
  });

  const handleCopyToken = (tokenId: string, token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedId(tokenId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevokeToken = (tokenId: string) => {
    if (confirm('Are you sure you want to revoke this token?')) {
      revokeMutation.mutate(tokenId);
    }
  };

  if (!tokens || tokens.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tokens created yet. Create your first token to get started.
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>League</TableHead>
            <TableHead>Token</TableHead>
            <TableHead>Expires At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token) => {
            const isExpired = new Date(token.expiresAt) < new Date();
            const isActive = !token.revoked && !isExpired;

            return (
              <TableRow key={token.id}>
                <TableCell className="font-medium">{token.league?.name || 'Unknown League'}</TableCell>
                <TableCell className="font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <span className="truncate max-w-[200px]">{token.token}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyToken(token.id, token.token)}
                      className="h-6 w-6 p-0 cursor-pointer"
                      title="Copy token"
                    >
                      {copiedId === token.id ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(token.expiresAt), "PPp")}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {token.revoked ? "Revoked" : isExpired ? "Expired" : "Active"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {isActive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeToken(token.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
