function flowNext(completed, current, inqueue, type, doPush = true) {
    if (current != null && doPush) {
        completed.push(current)
    }
    switch (type.toString()) {
        case '1':
            if (inqueue.length == 0) {
                current = null
            } else {
                current = inqueue.shift()
            }
            break
        case '2':
            if (inqueue.length == 0) {
                current = null
            } else {
                let idx = Math.floor(Math.random() * (inqueue.length - 1)) + 0
                current = inqueue[idx]
                inqueue.splice(idx, 1)
            }
            break
        case '3':
            if (inqueue.length == 0) {
                inqueue = completed
                completed = []
            }
            current = inqueue.shift()
            break
        case '4':
            if (inqueue.length == 0) {
                inqueue = completed
                completed = []
            }
            let idx = Math.floor(Math.random() * (inqueue.length - 1)) + 0
            current = inqueue[idx]
            inqueue.splice(idx, 1)
            break
    }
    return {
        completed: completed,
        current: current,
        inqueue: inqueue
    }
}

module.exports = {
    flowNext
}

// console.log(flowNext([], null, ['11', '宿霸', '肥宅', '舍暴'], 1))