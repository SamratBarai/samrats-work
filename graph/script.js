class InteractiveGraph {
    constructor() {
        this.canvas = document.getElementById('graphCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.points = [];
        this.isDragging = false;
        this.dragIndex = -1;
        this.curveType = 'line';
        this.gridSnapping = false;
        this.darkMode = true; // Set dark mode as default
        
        this.setupCanvas();
        this.setupEventListeners();
        this.draw();
    }

    setupCanvas() {
        // Set canvas size to match its display size
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Graph boundaries
        this.padding = 60;
        this.graphWidth = this.canvas.width - 2 * this.padding;
        this.graphHeight = this.canvas.height - 2 * this.padding;
        
        // Coordinate system
        this.xMin = -10;
        this.xMax = 10;
        this.yMin = -8;
        this.yMax = 8;
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('contextmenu', (e) => this.handleRightClick(e));
        
        document.getElementById('curveType').addEventListener('change', (e) => {
            this.curveType = e.target.value;
            this.updateEquation();
            this.draw();
        });

        document.getElementById('gridSnapping').addEventListener('change', (e) => {
            this.gridSnapping = e.target.checked;
        });

        document.getElementById('darkMode').addEventListener('change', (e) => {
            this.darkMode = e.target.checked;
            document.body.classList.toggle('dark-mode', this.darkMode);
            this.draw();
        });
        document.getElementById('darkMode').checked = true; // Ensure toggle is checked
        document.body.classList.add('dark-mode'); // Ensure class is set

        // Handle window resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.draw();
        });
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        // Convert to graph coordinates
        let graphX = this.xMin + (x - this.padding) / this.graphWidth * (this.xMax - this.xMin);
        let graphY = this.yMax - (y - this.padding) / this.graphHeight * (this.yMax - this.yMin);
        
        // Apply grid snapping if enabled
        if (this.gridSnapping) {
            graphX = Math.round(graphX);
            graphY = Math.round(graphY);
        }
        
        return { x: graphX, y: graphY, canvasX: x, canvasY: y };
    }

    handleMouseDown(e) {
        const pos = this.getMousePos(e);
        const clickedPointIndex = this.getPointAt(pos.canvasX, pos.canvasY);
        
        if (clickedPointIndex !== -1) {
            this.isDragging = true;
            this.dragIndex = clickedPointIndex;
            this.canvas.style.cursor = 'grabbing';
        } else {
            // Add new point
            this.points.push({ x: pos.x, y: pos.y });
            this.updateEquation();
            this.draw();
        }
    }

    handleMouseMove(e) {
        const pos = this.getMousePos(e);
        
        if (this.isDragging && this.dragIndex !== -1) {
            this.points[this.dragIndex] = { x: pos.x, y: pos.y };
            this.updateEquation();
            this.draw();
        } else {
            // Update cursor
            const pointIndex = this.getPointAt(pos.canvasX, pos.canvasY);
            this.canvas.style.cursor = pointIndex !== -1 ? 'grab' : 'crosshair';
        }
    }

    handleMouseUp(e) {
        this.isDragging = false;
        this.dragIndex = -1;
        this.canvas.style.cursor = 'crosshair';
    }

    handleRightClick(e) {
        e.preventDefault();
        const pos = this.getMousePos(e);
        const clickedPointIndex = this.getPointAt(pos.canvasX, pos.canvasY);
        
        if (clickedPointIndex !== -1) {
            this.points.splice(clickedPointIndex, 1);
            this.updateEquation();
            this.draw();
        }
    }

    getPointAt(canvasX, canvasY) {
        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i];
            const screenPos = this.graphToScreen(point.x, point.y);
            const distance = Math.sqrt(
                Math.pow(canvasX - screenPos.x, 2) + 
                Math.pow(canvasY - screenPos.y, 2)
            );
            if (distance <= 8) {
                return i;
            }
        }
        return -1;
    }

    graphToScreen(graphX, graphY) {
        const x = this.padding + (graphX - this.xMin) / (this.xMax - this.xMin) * this.graphWidth;
        const y = this.padding + (this.yMax - graphY) / (this.yMax - this.yMin) * this.graphHeight;
        return { x, y };
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawGrid();
        this.drawAxes();
        this.drawCurve();
        this.drawPoints();
    }

    drawGrid() {
        this.ctx.strokeStyle = this.darkMode ? '#4a4a4a' : '#e0e0e0';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = this.xMin; x <= this.xMax; x++) {
            const screenPos = this.graphToScreen(x, 0);
            this.ctx.beginPath();
            this.ctx.moveTo(screenPos.x, this.padding);
            this.ctx.lineTo(screenPos.x, this.canvas.height - this.padding);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = this.yMin; y <= this.yMax; y++) {
            const screenPos = this.graphToScreen(0, y);
            this.ctx.beginPath();
            this.ctx.moveTo(this.padding, screenPos.y);
            this.ctx.lineTo(this.canvas.width - this.padding, screenPos.y);
            this.ctx.stroke();
        }
    }

    drawAxes() {
        this.ctx.strokeStyle = this.darkMode ? '#e0e0e0' : '#333333';
        this.ctx.lineWidth = 2;
        
        // X-axis
        const xAxisY = this.graphToScreen(0, 0).y;
        this.ctx.beginPath();
        this.ctx.moveTo(this.padding, xAxisY);
        this.ctx.lineTo(this.canvas.width - this.padding, xAxisY);
        this.ctx.stroke();
        
        // Y-axis
        const yAxisX = this.graphToScreen(0, 0).x;
        this.ctx.beginPath();
        this.ctx.moveTo(yAxisX, this.padding);
        this.ctx.lineTo(yAxisX, this.canvas.height - this.padding);
        this.ctx.stroke();
        
        // Labels
        this.ctx.fillStyle = this.darkMode ? '#e0e0e0' : '#333333';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        
        // X-axis labels
        for (let x = this.xMin; x <= this.xMax; x += 2) {
            if (x !== 0) {
                const screenPos = this.graphToScreen(x, 0);
                this.ctx.fillText(x.toString(), screenPos.x, xAxisY + 20);
            }
        }
        
        // Y-axis labels
        this.ctx.textAlign = 'right';
        for (let y = this.yMin; y <= this.yMax; y += 2) {
            if (y !== 0) {
                const screenPos = this.graphToScreen(0, y);
                this.ctx.fillText(y.toString(), yAxisX - 10, screenPos.y + 4);
            }
        }
    }

    drawCurve() {
        if (this.points.length < 2) return;
        
        this.ctx.strokeStyle = this.darkMode ? '#8b9dc3' : '#667eea';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        if (this.curveType === 'line' && this.points.length >= 2) {
            this.drawLine();
        } else if (this.curveType === 'parabola' && this.points.length >= 3) {
            this.drawParabola();
        } else if (this.curveType === 'exponential' && this.points.length >= 2) {
            this.drawExponential();
        } else if (this.curveType === 'polynomial' && this.points.length >= 2) {
            this.drawPolynomial();
        } else {
            // Draw connecting lines for insufficient points
            for (let i = 0; i < this.points.length; i++) {
                const screenPos = this.graphToScreen(this.points[i].x, this.points[i].y);
                if (i === 0) {
                    this.ctx.moveTo(screenPos.x, screenPos.y);
                } else {
                    this.ctx.lineTo(screenPos.x, screenPos.y);
                }
            }
        }
        
        this.ctx.stroke();
    }

    drawLine() {
        const p1 = this.points[0];
        const p2 = this.points[1];
        
        const startX = this.xMin;
        const endX = this.xMax;
        
        const slope = (p2.y - p1.y) / (p2.x - p1.x);
        const intercept = p1.y - slope * p1.x;
        
        const startY = slope * startX + intercept;
        const endY = slope * endX + intercept;
        
        const startScreen = this.graphToScreen(startX, startY);
        const endScreen = this.graphToScreen(endX, endY);
        
        this.ctx.moveTo(startScreen.x, startScreen.y);
        this.ctx.lineTo(endScreen.x, endScreen.y);
    }

    drawParabola() {
        // Simple parabola fitting using first 3 points
        if (this.points.length < 3) return;
        
        const p1 = this.points[0];
        const p2 = this.points[1];
        const p3 = this.points[2];
        
        // Calculate parabola coefficients y = ax² + bx + c
        const x1 = p1.x, y1 = p1.y;
        const x2 = p2.x, y2 = p2.y;
        const x3 = p3.x, y3 = p3.y;
        
        const denom = (x1 - x2) * (x1 - x3) * (x2 - x3);
        const a = (x3 * (y2 - y1) + x2 * (y1 - y3) + x1 * (y3 - y2)) / denom;
        const b = (x3*x3 * (y1 - y2) + x2*x2 * (y3 - y1) + x1*x1 * (y2 - y3)) / denom;
        const c = (x2 * x3 * (x2 - x3) * y1 + x3 * x1 * (x3 - x1) * y2 + x1 * x2 * (x1 - x2) * y3) / denom;
        
        this.ctx.beginPath();
        let first = true;
        
        for (let x = this.xMin; x <= this.xMax; x += 0.1) {
            const y = a * x * x + b * x + c;
            const screenPos = this.graphToScreen(x, y);
            
            if (first) {
                this.ctx.moveTo(screenPos.x, screenPos.y);
                first = false;
            } else {
                this.ctx.lineTo(screenPos.x, screenPos.y);
            }
        }
    }

    drawExponential() {
        // Simple exponential fitting y = a * e^(bx)
        if (this.points.length < 2) return;
        
        const p1 = this.points[0];
        const p2 = this.points[1];
        
        // Calculate coefficients
        const b = Math.log(p2.y / p1.y) / (p2.x - p1.x);
        const a = p1.y / Math.exp(b * p1.x);
        
        this.ctx.beginPath();
        let first = true;
        
        for (let x = this.xMin; x <= this.xMax; x += 0.1) {
            const y = a * Math.exp(b * x);
            if (y > this.yMax * 2) continue; // Prevent overflow
            
            const screenPos = this.graphToScreen(x, y);
            
            if (first) {
                this.ctx.moveTo(screenPos.x, screenPos.y);
                first = false;
            } else {
                this.ctx.lineTo(screenPos.x, screenPos.y);
            }
        }
    }

    drawPolynomial() {
        if (this.points.length < 2) return;
        
        // Use Lagrange interpolation for polynomial fitting
        this.ctx.beginPath();
        let first = true;
        
        for (let x = this.xMin; x <= this.xMax; x += 0.1) {
            const y = this.lagrangeInterpolation(x);
            if (Math.abs(y) > 1000) continue; // Prevent overflow
            
            const screenPos = this.graphToScreen(x, y);
            
            if (first) {
                this.ctx.moveTo(screenPos.x, screenPos.y);
                first = false;
            } else {
                this.ctx.lineTo(screenPos.x, screenPos.y);
            }
        }
    }

    lagrangeInterpolation(x) {
        let result = 0;
        const n = this.points.length;
        
        for (let i = 0; i < n; i++) {
            let term = this.points[i].y;
            
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    term *= (x - this.points[j].x) / (this.points[i].x - this.points[j].x);
                }
            }
            
            result += term;
        }
        
        return result;
    }

    drawPoints() {
        this.points.forEach((point, index) => {
            const screenPos = this.graphToScreen(point.x, point.y);
            
            // Point circle
            this.ctx.fillStyle = this.darkMode ? '#a67bc5' : '#764ba2';
            this.ctx.beginPath();
            this.ctx.arc(screenPos.x, screenPos.y, 8, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Point border
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Point label
            this.ctx.fillStyle = this.darkMode ? '#e0e0e0' : '#333333';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`P${index + 1}`, screenPos.x, screenPos.y - 15);
        });
    }

    updateEquation() {
        const equationElement = document.getElementById('equation');
        const pointInfoElement = document.getElementById('pointInfo');
        const warningElement = document.getElementById('warning');
        
        // Hide warning by default
        warningElement.style.display = 'none';
        
        if (this.points.length === 0) {
            equationElement.textContent = 'Click on the graph to add points';
            pointInfoElement.innerHTML = '';
            return;
        }
        
        if (this.points.length === 1) {
            equationElement.textContent = `Point: (${this.points[0].x.toFixed(2)}, ${this.points[0].y.toFixed(2)})`;
            pointInfoElement.innerHTML = `
                <div class="point-card">
                    <h5>P1</h5>
                    <p>(${this.points[0].x.toFixed(2)}, ${this.points[0].y.toFixed(2)})</p>
                </div>
            `;
            return;
        }
        
        let equation = '';
        
        if (this.curveType === 'line' && this.points.length >= 2) {
            const p1 = this.points[0];
            const p2 = this.points[1];
            
            const slope = (p2.y - p1.y) / (p2.x - p1.x);
            const intercept = p1.y - slope * p1.x;
            
            equation = `y = ${slope.toFixed(3)}x ${intercept >= 0 ? '+' : ''} ${intercept.toFixed(3)}`;
        } else if (this.curveType === 'parabola' && this.points.length >= 3) {
            const p1 = this.points[0];
            const p2 = this.points[1];
            const p3 = this.points[2];
            
            const x1 = p1.x, y1 = p1.y;
            const x2 = p2.x, y2 = p2.y;
            const x3 = p3.x, y3 = p3.y;
            
            const denom = (x1 - x2) * (x1 - x3) * (x2 - x3);
            const a = (x3 * (y2 - y1) + x2 * (y1 - y3) + x1 * (y3 - y2)) / denom;
            const b = (x3*x3 * (y1 - y2) + x2*x2 * (y3 - y1) + x1*x1 * (y2 - y3)) / denom;
            const c = (x2 * x3 * (x2 - x3) * y1 + x3 * x1 * (x3 - x1) * y2 + x1 * x2 * (x1 - x2) * y3) / denom;
            
            equation = `y = ${a.toFixed(3)}x² ${b >= 0 ? '+' : ''} ${b.toFixed(3)}x ${c >= 0 ? '+' : ''} ${c.toFixed(3)}`;
        } else if (this.curveType === 'exponential' && this.points.length >= 2) {
            const p1 = this.points[0];
            const p2 = this.points[1];
            
            const b = Math.log(p2.y / p1.y) / (p2.x - p1.x);
            const a = p1.y / Math.exp(b * p1.x);
            
            equation = `y = ${a.toFixed(3)}e^(${b.toFixed(3)}x)`;
        } else if (this.curveType === 'polynomial') {
            equation = this.getPolynomialEquation();
            
            // Show warning for high-degree polynomials
            if (this.points.length > 6) {
                warningElement.textContent = `Note: High-degree polynomial (${this.points.length-1}th degree) may oscillate between points.`;
                warningElement.style.display = 'block';
            }
        } else {
            equation = 'Add more points for equation calculation';
        }
        
        equationElement.textContent = equation;
        
        // Update point info
        const pointCards = this.points.map((point, index) => `
            <div class="point-card">
                <h5>P${index + 1}</h5>
                <p>(${point.x.toFixed(2)}, ${point.y.toFixed(2)})</p>
            </div>
        `).join('');
        
        pointInfoElement.innerHTML = pointCards;
    }

    getPolynomialEquation() {
        const n = this.points.length;
        if (n < 2) return '';
        
        // Use Lagrange interpolation to get polynomial coefficients
        // For display purposes, we'll format it as a sum of terms
        let terms = [];
        
        for (let i = 0; i < n; i++) {
            let term = '';
            let coefficient = this.points[i].y;
            
            // Calculate the denominator for this term
            let denominator = 1;
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    denominator *= (this.points[i].x - this.points[j].x);
                }
            }
            
            coefficient /= denominator;
            
            // Build the term
            if (Math.abs(coefficient) > 1e-10) {
                let coeffStr = coefficient.toFixed(3);
                
                // For the first term, handle the sign differently
                if (terms.length === 0) {
                    if (coefficient < 0) {
                        term = `- ${Math.abs(coefficient).toFixed(3)}`;
                    } else {
                        term = coeffStr;
                    }
                } else {
                    if (coefficient < 0) {
                        term = `- ${Math.abs(coefficient).toFixed(3)}`;
                    } else {
                        term = `+ ${coeffStr}`;
                    }
                }
                
                // Add the polynomial factors
                for (let j = 0; j < n; j++) {
                    if (i !== j) {
                        if (this.points[j].x === 0) {
                            term += 'x';
                        } else if (this.points[j].x > 0) {
                            term += `(x - ${this.points[j].x.toFixed(2)})`;
                        } else {
                            term += `(x + ${Math.abs(this.points[j].x).toFixed(2)})`;
                        }
                    }
                }
                
                terms.push(term);
            }
        }
        
        if (terms.length === 0) return 'y = 0';
        
        return 'y = ' + terms.join(' ');
    }
}

// Initialize the graph
let graph;
window.addEventListener('load', () => {
    graph = new InteractiveGraph();
});

// Global functions for buttons
function clearPoints() {
    graph.points = [];
    graph.updateEquation();
    graph.draw();
}

function addRandomPoints() {
    graph.points = [];
    let numPoints;
    
    switch(graph.curveType) {
        case 'line':
            numPoints = 2;
            break;
        case 'parabola':
            numPoints = 3;
            break;
        case 'exponential':
            numPoints = 2;
            break;
        case 'polynomial':
            numPoints = 5; // More points for polynomial
            break;
        default:
            numPoints = 2;
    }
    
    for (let i = 0; i < numPoints; i++) {
        let x, y;
        if (graph.gridSnapping) {
            x = Math.floor((Math.random() - 0.5) * 16); // -8 to 8, snapped
            y = Math.floor((Math.random() - 0.5) * 12); // -6 to 6, snapped
        } else {
            x = (Math.random() - 0.5) * 16; // -8 to 8
            y = (Math.random() - 0.5) * 12; // -6 to 6
        }
        graph.points.push({ x, y });
    }
    
    graph.updateEquation();
    graph.draw();
}