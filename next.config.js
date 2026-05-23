const { gaVersion } = require('./components/api_calls/release_calls');

const FALLBACK_GA_VERSION = '4.21';

module.exports = {
    transpilePackages: ["antd", "@ant-design", "rc-util", "rc-pagination", "rc-picker", "rc-notification", "rc-tooltip", "rc-tree", "rc-table"],
    async redirects() {
        let currentGaVersion = FALLBACK_GA_VERSION;
        try {
            const gaResponse = await gaVersion();
            if (gaResponse && gaResponse.payload) {
                currentGaVersion = gaResponse.payload;
            }
        } catch (e) {
            console.error('[next.config.js] gaVersion failed, using fallback:', e.message);
        }

        return [
            {
                source: '/dashboard',
                destination: `/dashboard/release/openshift-${currentGaVersion}`,
                permanent: false,
            },
        ];
    }
};