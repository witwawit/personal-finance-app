import IconOverview from '../assets/images/icon-nav-overview.svg'
import IconTransaction from '../assets/images/icon-nav-transactions.svg'
import IconBudgets from '../assets/images/icon-nav-budgets.svg'
import IconPots from '../assets/images/icon-nav-pots.svg'
import IconRecurring from '../assets/images/icon-nav-recurring-bills.svg'

interface menuItem {
    path: string;
    name: string;
    logo: string;
}

export const navigations: menuItem[] = [
    {
        path: '/overview',
        name: 'Overview',
        logo: IconOverview,
    },
    {
        path: '/transaction',
        name: 'Transaction',
        logo: IconTransaction,
    },
    {
        path: '/budgets',
        name: 'Budgets',
        logo: IconBudgets,
    },
    {
        path: '/pots',
        name: 'Pots',
        logo: IconPots,
    },
    {
        path: '/recurring-bills',
        name: 'Recurring Bills',
        logo: IconRecurring,
    }
]