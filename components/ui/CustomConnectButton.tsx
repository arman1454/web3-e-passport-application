// CustomConnectButton.jsx
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils'; // ensure you have this utility to merge classes

// Define button variants for styling consistency
const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md",
                secondary:
                    "bg-background text-secondary-foreground hover:bg-secondary/80 rounded-md",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 rounded-lg px-7",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export const CustomConnectButton = () => {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus || authenticationStatus === 'authenticated');

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            style: {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button
                                        onClick={openConnectModal}
                                        type="button"
                                        className={cn(buttonVariants({ variant: "default", size: "sm" }))}
                                    >
                                        Connect Wallet
                                    </button>
                                );
                            }
                            if (chain.unsupported) {
                                return (
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                        className={cn(buttonVariants({ variant: "destructive", size: "default" }))}
                                    >
                                        Wrong network
                                    </button>
                                );
                            }
                            return (
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                        className={cn(buttonVariants({ variant: "outline", size: "default" }))}
                                    >
                                        {chain.hasIcon && (
                                            <div className="mr-2 w-4 h-4 rounded-full overflow-hidden">
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                        className="w-full h-full"
                                                    />
                                                )}
                                            </div>
                                        )}
                                        <span className="text-foreground">{chain.name}</span>
                                    </button>
                                    <button
                                        onClick={openAccountModal}
                                        type="button"
                                        className={cn(buttonVariants({ variant: "secondary", size: "default" }))}
                                    >
                                        <span className="text-secondary-foreground">{account.displayName}</span>
                                        {account.displayBalance ? 
                                            <span className="text-secondary-foreground">
                                                {` (${account.displayBalance})`}
                                            </span> 
                                            : ''}
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};
