// window.localStorage to retrieve data

const Storage = () => {

    function save(allProjects) {
        window.localStorage.setItem("myProjects", JSON.stringify(allProjects) );
        console.log(window.localStorage.getItem("myProjects"));
    };

    const project = () => {
        var projectStorage = JSON.parse(window.localStorage.getItem("myProjects"));
        return projectStorage;
    };

    function storeNames(projectNames) {
        window.localStorage.setItem("projectNames", JSON.stringify(projectNames) );
        console.log(window.localStorage.getItem("projectNames"));
    };

    const names = () => {
        var projectNames = JSON.parse(window.localStorage.getItem("projectNames"));
        return projectNames;
    }

    return {save, project, storeNames, names};
};

export {Storage};