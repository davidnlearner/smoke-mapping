const InfoBox = () => {

    return (
        <div className="info-box">
            <p>This is a map of modeled wildfire-driven smoke pollution, by county, from 2006 through 2020.
                It displays each county's maximum particulate matter measurement in a given month, using{" "}
                <a href="https://github.com/echolab-stanford/daily-10km-smokePM" target="_blank" rel="noreferrer">
                    data compiled by Marissa L. Childs et al.</a></p>

            <p> Project by <a href="https://www.david-learner.com/" target="_blank" rel="noreferrer">David Learner</a>.</p>

        </div>
    );
};

export default InfoBox;