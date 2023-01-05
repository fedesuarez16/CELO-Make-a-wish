
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// This contract allows for the creation of a crowdfunding project.
// The project has an id, a name, a description, an author, a state, funds raised, and a fundraising goal.
contract CrowdFunding {
    // Enum for the different states a project can be in: active or inactive
    enum FundRaisingState {active, inactive}

    // Struct to represent a project
    struct Project {
        string id; // ID of the project
        string name; // Name of the project
        string description; // Description of the project
        address payable author; // Address of the author of the project
        FundRaisingState state; // Current state of the project
        uint256 funds; // Amount of funds raised so far
        uint256 fundraisingGoal; // Fundraising goal for the project
    }

    // Public variable to store the project
    Project public project;

    // Event triggered when a project is funded
    event ProjectFunded(string projectId, uint256 value);

    // Event triggered when a project's state is changed
    event ProjectStateChanged(string id, uint256 FundRaisingState);

    // Constructor function to create a new project
    // It takes in the following parameters:
    // - _id: ID of the project
    // - _name: Name of the project
    // - _description: Description of the project
    // - _fundraisingGoal: Fundraising goal for the project
    constructor(
        string memory _id,
        string memory _name,
        string memory _description,
        uint256 _fundraisingGoal
    ) {
          // Initialize the project with the given parameters
          project = Project(
            _id,
            _name,
            _description,
            payable(msg.sender), // Set the project author to the caller of the constructor function
            FundRaisingState.active, // Set the initial state of the project to active
            0, // Initialize the funds raised to 0
            _fundraisingGoal // Set the fundraising goal to the given value
        );
    }

    // Modifier to check if the caller of the function is the author of the project
    modifier isAuthor() {
        // If the caller is not the author of the project, throw an error
        require(
            project.author == msg.sender,
            "You need to be the project author"
        );
        // If the caller is the author, continue execution of the function
        _;
    }

    // Modifier to check if the caller of the function is not the author of the project
    modifier isNotAuthor() {
        // If the caller is the author of the project, throw an error
        require(
            project.author != msg.sender,
            "As author you can not fund your own project"
        );
        // If the caller is not the author, continue execution of the function
        _;
    }

      // Function to fund a project
    // It takes in the following parameter:
    // - value: Amount to fund the project with
    function fundProject(uint value) public payable {
        // If the project is inactive, throw an error
        require(project.state != FundRaisingState.inactive, "The project can not receive funds");
        // If the value to fund the project with is 0 or less, throw an error
        require(value > 0, "Fund value must be greater than 0");
        // Transfer the funds to the project author
        project.author.transfer(value);
        // Add the funded value to the project's funds
        project.funds += value;
        // Emit an event to indicate that the project has been funded
        emit ProjectFunded(project.id, value);
    }

    // Function to change the state of a project
    // It takes in the following parameter:
    // - newState: The new state to set the project to (active or inactive)
    function changeProjectState(FundRaisingState newState) public isAuthor {
        // If the new state is the same as the current state, throw an error
        require(project.state != newState, "New state must be different");
        // Set the project's state to the new state
        project.state = newState;

    }

    // View function to get the fundraising goal of a project
    function getFundRaisingGoal () public view returns (uint) {
        // Return the fundraising goal of the project
        return project.fundraisingGoal;
    }

    // View function to get the current amount of funds raised for a project
    function getFundsState () public view returns (uint) {
        // Return the current amount of funds raised for the project
        return project.funds;
    }
}
