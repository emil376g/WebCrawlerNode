$(document).ready(function() {
    var rep;
    $("#postdata").hide();
    $("#form2").hide();
    $('#form1').submit(function(e) {

        e.preventDefault();
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://127.0.0.1:54321/crawl?key=78942ef2c1c98bf10fca09c808d718fa3734703e",
            "method": "GET",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
                "url": $("#url").val(),
                "selector": $("#selector").val()
            }
        };

        $.ajax(settings).done(function(response) {
            $("#form2").show();
            $("#postdata").show();
            rep = JSON.parse(JSON.stringify(response));
            console.log(JSON.stringify(rep));
            rep.forEach(element => {
                for (let index = 0; index < element.length; index++) {
                    $("#dump").append(JSON.stringify(element[index]).substring((0 + 1), JSON.stringify(element[index]).length - 1) + '\n');
                }
            });
        });
    });
    $("#mønster").change(function(e) {
        e.preventDefault();
        $('#data').html('');
        $('#data').append('<tr></tr>');
        for (let p = 0; p < $("#mønster").val().length; p++) {

            switch ($("#mønster").val().charAt(p)) {
                case 'd':
                    $('#data tr:first').append('<th class="date">date</th>');
                    break;
                case 't':
                    $('#data tr:first').append('<th class="title">title</th>');
                    break;
                case 'b':
                    $('#data tr:first').append('<th class="description">description</th>');
                    break;
                case 'p':
                    $('#data tr:first').append('<th class="place">place</th>');
                    break;
                default:
                    break;
            }
        }
        for (let j = 0; j < rep.length; j++) {
            let i = 0;

            for (let index = 0; index < rep[j].length / 4; index++) {
                $('#data tr:last').after('<tr class="data"></tr>');
                for (let k = 0; k < $("#mønster").val().length; k++) {
                    if ($("#mønster").val().charAt(k) == 'd' || $("#mønster").val().charAt(k) == 'b' || $("#mønster").val().charAt(k) == 't' || $("#mønster").val().charAt(k) == 'p') {
                        $("#data tr:last").append('<td><input class="' + $('#mønster').val().charAt(k) + '" type="text"></td>');
                    }
                }
                for (let index2 = 0; index2 < $('#data tr:last').children().length; index2++) {
                    console.log(i)
                    if ($('#data tr:last').children()[index2].value == '')
                        i++;
                    if (i >= 4) {
                        $('#data tr:last').remove();
                    }
                }
            }
        }
        for (let index1 = 0; index1 < rep.length; index1++) {
            let indexer = 0;
            for (let index2 = 0; index2 < rep[index1].length / 4; index2++) {
                for (let index = 0; index < $('#mønster').val().length; index++) {
                    switch ($("#mønster").val().charAt(index)) {
                        case 'd':
                            $('.d:eq(' + index2 + ')').val(JSON.stringify(rep[index1][indexer]));
                            indexer++;
                            break;
                        case 't':
                            $('.t:eq(' + index2 + ')').val(JSON.stringify(rep[index1][indexer]));
                            indexer++;
                            break;
                        case 'b':
                            if (JSON.stringify(rep[index1][indexer]) != undefined) {
                                $('.b:eq(' + index2 + ')').val(JSON.stringify(rep[index1][indexer]));
                                indexer++;
                            }
                            break;
                        case 'p':
                            $('.p:eq(' + index2 + ')').val(JSON.stringify(rep[index1][indexer]));
                            indexer++;
                            break;
                        default:
                            indexer++;
                            break;
                    }
                }
            }
        }
    });
    $("#postdata").click(function(e) {
        e.preventDefault();
        var json = [];

        for (let element = 0; element < $("#data").children().length; element++) {
            let i = 0;
            let date;
            let title;
            let des;
            let place;
            for (let input = 0; input < 4; input++) {
                if ($("#data").children()[element].children[input].children[0] != undefined) {
                    switch ($("#mønster").val().charAt(i)) {
                        case 'd':
                            console.log($("#data").children()[element].children[input].children[0].value)
                            date = $("#data").children()[element].children[input].children[0].value;
                            i++;
                            break;
                        case 't':
                            console.log($("#data").children()[element].children[input].children[0].value)
                            title = $("#data").children()[element].children[input].children[0].value;
                            i++;
                            break;
                        case 'b':
                            console.log($("#data").children()[element].children[input].children[0].value)
                            des = $("#data").children()[element].children[input].children[0].value;
                            i++;
                            break;
                        case 'p':
                            console.log($("#data").children()[element].children[input].children[0].value)
                            place = $("#data").children()[element].children[input].children[0].value;
                            i++;
                            break;
                        default:
                            break;
                    }
                }
            }
            if (title != undefined && place != undefined && date != undefined) {
                json.push({ date: date, place: place, title: title, description: des, url: $("#url").val(), datastructur: $("#mønster").val(), crawlClass: $("#selector").val() })
                console.log(JSON.stringify(json));
                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "https://127.0.0.1:54321/crawl?key=78942ef2c1c98bf10fca09c808d718fa3734703e",
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "processData": false,
                    "data": JSON.stringify(json)
                }

                $.ajax(settings).done(function(response) {
                    console.log(response);
                });
                // $.post("https://127.0.0.1:54321/crawl?key=78942ef2c1c98bf10fca09c808d718fa3734703e", JSON.stringify(json), function(data) {
                //     console.log(data);
                // })
                json = [];
            }
        }
    })
    $('#dump').change(function(e) {
        e.preventDefault();
        let array = [];
        let array2 = []
        for (let index = 0; index < $("#dump").val().split('\n').length; index++) {
            array.push($("#dump").val().split('\n')[index]);
        }
        array2.push(array);
        rep = array2;
        console.log(JSON.stringify(rep));
    });
});