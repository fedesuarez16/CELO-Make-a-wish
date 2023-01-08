
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(address, address, uint256) external returns (bool);

    function balanceOf(address) external view returns (uint256);
}

/// @title This contract allows for the creation of a crowdfunding project.
/// @notice The project has an id, a name, a description, an author, a state, funds raised, and a fundraising goal.
contract CrowdFunding {
    /// @notice Enum for the different states a project can be in: active or inactive
    /// @param active Project is still active
    /// @param inactive Project is no longer active
    enum FundRaisingState {active, inactive}

    /// @notice Struct to represent a project
    struct Project {
        string id; // ID of the project
        string name; // Name of the project
        string description; // Description of the project
        address payable author; // Address of the author of the project
        FundRaisingState state; // Current state of the project
        uint256 cusdFunds; // Amount of funds raised in cUSD
        uint256 celoFunds; // Amount of funds raised in Celo
        uint256 fundraisingGoal; // Fundraising goal for the project
    }

    /// @notice Public variable to store projects
    mapping(string => Project) public projects;

    address cusdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    /// @notice Event triggered when a project is funded
    /// @param projectId ID of project to be funded
    /// @param value Amount to fund project with
    event ProjectFunded(string projectId, uint256 value);

    /// @notice Event triggered when a project's state is changed
    /// @param id Project Id
    /// @param FundRaisingState Project state
    event ProjectStateChanged(string id, uint256 FundRaisingState);

    /// @notice Constructor function to create a new project    
    /// @param _id ID of the project
    /// @param _name Name of the project
    /// @param _description Description of the project
    /// @param _fundraisingGoal Fundraising goal for the project
    function createProject (
        string calldata _id,
        string calldata _name,
        string calldata _description,
        uint256 _fundraisingGoal
    ) public {
          require(projects[_id].author == address(0), "Project ID already taken");
          // Initialize the project with the given parameters
          projects[_id] = Project(
            _id,
            _name,
            _description,
            payable(msg.sender), // Set the project author to the caller of the constructor function
            FundRaisingState.active, // Set the initial state of the project to active
            0, // Initialize the funds raised to 0
            0,
            _fundraisingGoal // Set the fundraising goal to the given value
        );
    }

    /// @notice Modifier to check if the caller of the function is the author of the project
    modifier isAuthor(string calldata _id) {
        // If the caller is not the author of the project, throw an error
        require(
            projects[_id].author == msg.sender,
            "You need to be the project author"
        );
        // If the caller is the author, continue execution of the function
        _;
    }

    /// @notice Function to fund a project    
    /// @param value Amount (in cUSD) to fund the project with
    /// @param id Project Id
    function fundProject(uint value, string calldata id) public payable {
        // If the project is inactive, throw an error
        require(projects[id].state != FundRaisingState.inactive, "The project can not receive funds");        
        // Add the funded value to the project's funds
        projects[id].cusdFunds += value;
        projects[id].celoFunds += msg.value;      

        // transfer cUSD
        require(
        IERC20Token(cusdTokenAddress).transferFrom(
            msg.sender,
            projects[id].author,
            value
        ),
        "Transfer failed."
        );

        // Transfer the celo to the project author
        // Note: Update state change before making external call
        projects[id].author.transfer(msg.value);
        // Emit an event to indicate that the project has been funded
        emit ProjectFunded(id, value);
    }

    /// @notice Function to change the state of a project    
    /// @param newState The new state to set the project to (active or inactive)
    function changeProjectState(FundRaisingState newState, string calldata id) public isAuthor(id) {
        // If the new state is the same as the current state, throw an error
        require(projects[id].state != newState, "New state must be different");
        // Set the project's state to the new state
        projects[id].state = newState;

    }

    /// @notice Function to get the fundraising goal of a project
    /// @param id Project Id
    function getFundRaisingGoal (string calldata id) public view returns (uint) {
        // Return the fundraising goal of the project
        return projects[id].fundraisingGoal;
    }

    /// @notice Function to get the current amount of funds raised for a project
    /// @param id Project id
    function getFundsState (string calldata id) public view returns (uint, uint) {
        // Return the current amount of funds raised for the project
        return (projects[id].celoFunds, projects[id].cusdFunds);
    }
}
