// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract CrowdFunding {
    enum FundRaisingState {active, inactive}


    struct Project {
        string id;
        string name;
        string description;
        address payable author;
        FundRaisingState state;
        uint256 funds;
        uint256 fundraisingGoal;
    }

    Project public project;

    event ProjectFunded(string projectId, uint256 value);

    event ProjectStateChanged(string id, uint256 FundRaisingState);

     constructor(
        string memory _id,
        string memory _name,
        string memory _description,
        uint256 _fundraisingGoal
    ) {
          project = Project(
            _id,
            _name,
            _description,
            payable(msg.sender),
            FundRaisingState.active,
            0,
            _fundraisingGoal
        );
      
    }

    modifier isAuthor() {
        require(
            project.author == msg.sender,
            "You need to be the project author"
        );
        _;
    }

    modifier isNotAuthor() {
        require(
            project.author != msg.sender,
            "As author you can not fund your own project"
        );
        _;
    }

    function fundProject(uint) public payable {
        require(project.state != FundRaisingState.inactive, "The project can not receive funds");
        //require(msg.value > 0, "Fund value must be greater than 0");
        project.author.transfer(msg.value);
        project.funds += msg.value;
        emit ProjectFunded(project.id, msg.value);
    }

    function changeProjectState(FundRaisingState newState) public isAuthor {
        require(project.state != newState, "New state must be different");
        project.state = newState;
        //emit ProjectStateChanged(project.id, newState);
    }

      function getFundRaisingGoal () public view returns (uint) {
        return project.fundraisingGoal;
    }
}


// lunes: pudes avanzar en la funcion changeproject state creoq ya esta casi terminada ,le agregue el enum que necesitaba para funcionar 
//solo me queda ver como hacer para que el valor 1 y 0 figuren como project active o inactivef
//ya testie todas las funciones y andan bien, las agregue al abi del frontend    