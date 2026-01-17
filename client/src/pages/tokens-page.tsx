import { CreateTokenDialog } from '@/features/token/create-token-dialog/create-token-dialog';
import { TokenList } from '@/features/token/list/token-list';

export function TokensPage() {
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>Tokens</h1>
      <div className='flex justify-end items-center'>
        <CreateTokenDialog />
      </div>
      <TokenList />
    </div>
  );
}
