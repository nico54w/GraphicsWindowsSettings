
window.onload = () => {
    let tableProcessT = new gridjs.Grid();
    let currentValuesT = new gridjs.Grid();
    window.electronAPI.setCurrentValues(function (event, values) {
        let currentValues = values.map(item => (item.split('REG_SZ')).map(i => i.trim())).map(x => { return { "Name": x[0], "Value": x[1] } });
        currentValuesT.updateConfig({
            columns: ['Path', 'Value'],
            data: currentValues.map(item => {
                let a = "Error";
                if(item.Value == 'GpuPreference=0;') a = 'Windows Decides';
                if(item.Value == 'GpuPreference=1;') a = 'Integrated GPU';
                if(item.Value == 'GpuPreference=2;') a = 'Dedicated GPU';
                return [item.Name, a]
            })
        })
        if(currentValuesT.config.container != null)currentValuesT.forceRender(document.getElementById('currentValues'));
        else currentValuesT.render(document.getElementById('currentValues'));
    });
    window.electronAPI.setProcessValues(function (event, processes) {
        let proce = processes.filter((value ,index, array) =>
            index === array.findIndex((t) => (t.Name === value.Name && t.Path === value.Path && t.Path != null))
        );
        tableProcessT.updateConfig({
            columns: ['Name', 'Path'],
            data: proce.map(item => [item.Name, item.Path])
        });
        if(tableProcessT.config.container != null)tableProcessT.forceRender(document.getElementById('tableProcess'));
        else tableProcessT.render(document.getElementById('tableProcess'));
    });
    let valueTselected = [];
    let table = 0;
    currentValuesT.on('rowClick', (event, cell) => {
        if(valueTselected != [])valueTselected.map(a => $(valueTselected[a].removeClass("bg-success")));
        valueTselected = $(event.target.parentNode.childNodes).map(a => $(event.target.parentNode.childNodes[a]).addClass('bg-success'))
        table = 1;
    });
    tableProcessT.on('rowClick', (event, cell) => {
        if(valueTselected != [])valueTselected.map(a => $(valueTselected[a].removeClass("bg-success")));
        valueTselected = $(event.target.parentNode.childNodes).map(a => $(event.target.parentNode.childNodes[a]).addClass('bg-success'))
        table = 2;
    });
    window.electronAPI.confirmation(function () {
        window.electronAPI.getProcessValues();
        window.electronAPI.getCurrentValues();
    })
    $('#removeBtn').on('click', function (e) {
        console.log(valueTselected[0])
        if (valueTselected != [] && table == 1) {
            window.electronAPI.removeValue(valueTselected[0][0].innerHTML)
        }
    });
    function setTo(asd) {
        if (valueTselected != [] && table == 1) {
            window.electronAPI.setNewValue({ Path: valueTselected[0][0].innerHTML, Value: asd });
        }
    }
    $('#winBtn').on('click', function () {
        setTo('GpuPreference=0;');
    })
    $('#integratedBtn').on('click', function () {
        setTo('GpuPreference=1;');
    })
    $('#dedicatedBtn').on('click', function () {
        setTo('GpuPreference=2;');
    })
    $('#addBtn').on('click', function () {
        if (valueTselected != [] && table == 2) {
            console.log($(valueTselected[1]))
            window.electronAPI.setNewValue({ Path: valueTselected[1][0].innerHTML, Value: "GpuPreference=0;" });
        }
    })
    $('#fileBtn').on('click', function(){
        window.electronAPI.openFromFile();
    })
    window.electronAPI.getProcessValues();
    window.electronAPI.getCurrentValues();
}