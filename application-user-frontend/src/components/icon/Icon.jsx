export const IconSuccess = ({ extraClass }) => {
    const styles = {
        color: '#16a34a', // text-green-600
        width: '4rem',   // w-16
        height: '4rem',  // h-16
        marginLeft: 'auto', // mx-auto (left)
        marginRight: 'auto', // mx-auto (right)
        marginBottom: '1.5rem' // mb-6
    };
    return (
        <svg viewBox="0 0 24 24" style={styles}>
            <path fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
            </path>
        </svg>
    )
}

export const IconFail = ({ extraClass }) => {
    const styles = {
        color: '#dc2626', // text-green-600
        width: '4rem',   // w-16
        height: '4rem',  // h-16
        marginLeft: 'auto', // mx-auto (left)
        marginRight: 'auto', // mx-auto (right)
        marginBottom: '1.5rem' // mb-6
    };
    return (
        <svg viewBox="0 0 24 24" style={styles}>
            <path fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6,17.414L17.414,18,12,12.586,6.586,18,6,17.414,11.414,12,6,6.586,6.586,6,12,11.414,17.414,6,18,6.586,12.586,12,18,17.414Z">
            </path>
        </svg>
    )
}

export const IconWaiting = ({ extraClass }) => {
    const styles = {
        color: '#ca8a04', // text-green-600
        width: '4rem',   // w-16
        height: '4rem',  // h-16
        marginLeft: 'auto', // mx-auto (left)
        marginRight: 'auto', // mx-auto (right)
        marginBottom: '1.5rem' // mb-6
    };
    return (
        <svg viewBox="0 0 24 24" style={styles}>
            <path fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm0,5a1,1,0,1,1-1,1,1,1,0,0,1,1-1m0,14a1,1,0,1,1,1-1,1,1,0,0,1-1,1m-6-6a1,1,0,1,1,1-1,1,1,0,0,1-1,1m12,0a1,1,0,1,1,1-1,1,1,0,0,1-1,1M11,7v5h4v-2h-3Z">
            </path>
        </svg>
    )
}

export const IconLoading = () => {
    return (
        <span style={{ display: 'inline-block', marginRight: '8px'}} className="animate-spin">
            <svg style={{ height: '20px', width: '20px', color: 'white' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </span>
    )
}